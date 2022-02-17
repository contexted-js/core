export type PromiseOrValue<ValueType> = Promise<ValueType> | ValueType;

export type Middleware<Context, Injectables, IsImmutable extends boolean> = (
	context: Context,
	...injectables: Injectables[]
) => PromiseOrValue<IsImmutable extends true ? Context : void>;

export type Controller<Context, Injectables, IsImmutable extends boolean> = {
	middleware: Middleware<Context, Injectables, IsImmutable>;
	injectables?: Injectables[];
};

export type Route<Test, Context, Injectables, IsImmutable extends boolean> = {
	test: Test;
	controllers: Controller<Context, Injectables, IsImmutable>[];
};

export type Transformer<InputType, OutputType> = (
	input: InputType
) => PromiseOrValue<OutputType>;

export type Traverser<Context, Injectables, IsImmutable extends boolean> = (
	context: Context,
	...controllers: Controller<Context, Injectables, IsImmutable>[]
) => PromiseOrValue<Context>;

export type Unsubscriber = () => PromiseOrValue<void>;

export type Subscriber<Test, Request, Response> = (
	test: Test,
	callback: Transformer<Request, Response>
) => PromiseOrValue<Unsubscriber>;

export type Configuration<
	Test,
	Context,
	Injectables,
	Request,
	Response,
	IsImmutable extends boolean
> = {
	subscriber: Subscriber<Test, Request, Response>;
	traverser: Traverser<Context, Injectables, IsImmutable>;
	requestTransformer: Transformer<Request, Context>;
	responseTransformer: Transformer<Context, Response>;
};

export class Contexted<
	Test,
	Context,
	Injectables,
	Request,
	Response,
	IsImmutable extends boolean
> {
	private subscribersCount: number;
	private subscribers: {
		[uniqueId: string]: {
			controllers: Route<
				Test,
				Context,
				Injectables,
				IsImmutable
			>['controllers'];
			unsubscriber: Unsubscriber;
		};
	};

	private subscriber: Subscriber<Test, Request, Response>;
	private traverser: Traverser<Context, Injectables, IsImmutable>;
	private requestTransformer: Transformer<Request, Context>;
	private responseTransformer: Transformer<Context, Response>;

	constructor(
		configuration: Configuration<
			Test,
			Context,
			Injectables,
			Request,
			Response,
			IsImmutable
		>
	) {
		this.subscribersCount = 0;
		this.subscribers = {};

		this.subscriber = configuration.subscriber;
		this.traverser = configuration.traverser;
		this.requestTransformer = configuration.requestTransformer;
		this.responseTransformer = configuration.responseTransformer;
	}

	async subscribeRoute(
		route: Route<Test, Context, Injectables, IsImmutable>
	) {
		this.subscribersCount++;
		const uniqueId = this.subscribersCount.toString();

		try {
			const unsubscriber = await this.subscriber(
				route.test,
				async (request) => await this.requestHandler(uniqueId, request)
			);

			this.subscribers[uniqueId] = {
				unsubscriber,
				controllers: route.controllers,
			};
		} catch (error) {
			throw new Error('failed to subscribe route.' + error.toString());
		}

		return <Unsubscriber>(async () => {
			if (!this.subscribers[uniqueId])
				throw new Error(
					'failed to unsubscribe route. route has already been unsubscribed.'
				);

			try {
				await this.subscribers[uniqueId].unsubscriber();
				delete this.subscribers[uniqueId];
			} catch (error) {
				throw new Error(
					'failed to unsubscribe route.' + error.toString()
				);
			}

			if (this.subscribers[uniqueId])
				throw new Error(
					'failed to unsubscribe route. route still exists.'
				);
		});
	}

	private async requestHandler(subscriberId: string, request: Request) {
		if (!this.subscribers[subscriberId])
			throw new Error(
				'route not found. route has been unsubscribed or never existed.'
			);

		try {
			const context = await this.requestTransformer(request);
			const result = await this.traverser(
				context,
				...this.subscribers[subscriberId].controllers
			);

			return this.responseTransformer(result);
		} catch (error) {
			throw new Error('failed to handle request.' + error.toString());
		}
	}
}

export function createContextedInstance<
	Test,
	Context,
	Injectables,
	Request,
	Response,
	IsImmutable extends boolean
>(
	configuration: Configuration<
		Test,
		Context,
		Injectables,
		Request,
		Response,
		IsImmutable
	>
) {
	return new Contexted(configuration);
}
