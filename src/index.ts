export type AsyncReturn<ReturnType> = ReturnType | Promise<ReturnType>;

export type Context = { next: boolean };

export type Middleware<
	ContextType extends Context,
	InjectablesType = any,
	ImmutableContext extends boolean = false
> = (
	context: ContextType,
	...injectables: InjectablesType[]
) => AsyncReturn<ImmutableContext extends true ? ContextType : any>;

export type Controller<
	ContextType extends Context,
	InjectablesType = any,
	ImmutableContext extends boolean = false
> = {
	middleware: Middleware<ContextType, InjectablesType, ImmutableContext>;
	injectables?: InjectablesType[];
};

export type Route<
	TestType,
	ContextType extends Context,
	InjectablesType = any,
	ImmutableContext extends boolean = false
> = {
	test: TestType;
	controllers: Controller<ContextType, InjectablesType, ImmutableContext>[];
};

export type UnsubscribeFunction = () => AsyncReturn<boolean>;

export type SubscriberHandler<RequestType, ResponseType = RequestType> = (
	request: RequestType
) => AsyncReturn<ResponseType>;

export type Subscriber<TestType, RequestType, ResponseType = RequestType> = (
	test: TestType,
	handler: SubscriberHandler<RequestType, ResponseType>
) => AsyncReturn<UnsubscribeFunction>;

export type Generator<DataType, OutputType> = (
	input: DataType
) => AsyncReturn<OutputType>;

export async function subscribeRoute<
	TestType,
	ContextType extends Context,
	InjectablesType = any,
	RequestType = ContextType,
	ResponseType = RequestType,
	ImmutableContext extends boolean = true
>(
	subscriber: Subscriber<TestType, RequestType, ResponseType>,
	route: Route<TestType, ContextType, InjectablesType, ImmutableContext>,
	contextGenerator?: Generator<RequestType, ContextType>,
	responseGenerator?: Generator<ContextType, ResponseType>,
	immutableContext?: ImmutableContext
) {
	if (immutableContext === undefined || immutableContext === null)
		immutableContext = true as any;

	return await subscriber(route.test, async (request) => {
		let context: ContextType = contextGenerator
			? contextGenerator(request)
			: (request as any);

		for (const controller of route.controllers || []) {
			const result = await controller.middleware(
				context,
				...(controller.injectables || [])
			);

			if (immutableContext) context = result;
			if (!context.next) break;
		}

		return responseGenerator
			? responseGenerator(context)
			: (context as any);
	});
}

export type Configuration<
	TestType,
	ContextType extends Context,
	RequestType = ContextType,
	ResponseType = RequestType,
	ImmutableContext extends boolean = false
> = {
	subscriber: Subscriber<TestType, RequestType, ResponseType>;
	contextGenerator?: Generator<RequestType, ContextType>;
	responseGenerator?: Generator<ContextType, ResponseType>;
	immutableContext?: ImmutableContext;
};

export class Contexted<
	TestType,
	ContextType extends Context,
	InjectablesType = any,
	RequestType = ContextType,
	ResponseType = RequestType,
	ImmutableContext extends boolean = false
> {
	private subscriber: Subscriber<TestType, RequestType, ResponseType>;
	private contextGenerator: Generator<RequestType, ContextType>;
	private responseGenerator: Generator<ContextType, ResponseType>;
	private immutableContext: boolean;

	constructor(
		configuration: Configuration<
			TestType,
			ContextType,
			RequestType,
			ResponseType
		>
	) {
		this.subscriber = configuration.subscriber;
		this.contextGenerator = configuration.contextGenerator;
		this.responseGenerator = configuration.responseGenerator;
		this.immutableContext = configuration.immutableContext || false;
	}

	async subscribeRoute(
		route: Route<TestType, ContextType, InjectablesType, ImmutableContext>
	) {
		return subscribeRoute(
			this.subscriber,
			route,
			this.contextGenerator,
			this.responseGenerator,
			this.immutableContext
		);
	}
}
