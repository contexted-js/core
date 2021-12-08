export type AsyncReturn<ReturnType> = ReturnType | Promise<ReturnType>;

export type Context = { next: boolean };

export type Middleware<
	ContextType extends Context,
	InjectablesType = any,
	ImmutableContext = false
> = (
	context: ContextType,
	...injectables: InjectablesType[]
) => AsyncReturn<ImmutableContext extends true ? ContextType : any>;

export type Controller<
	ContextType extends Context,
	InjectablesType = any,
	ImmutableContext = false
> = {
	middleware: Middleware<ContextType, InjectablesType, ImmutableContext>;
	injectables?: InjectablesType[];
};

export type Route<
	TestType,
	ContextType extends Context,
	InjectablesType = any,
	ImmutableContext = false
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

async function handleImmutableControllers<
	ContextType extends Context,
	InjectablesType = any
>(
	context: ContextType,
	...controllers: Controller<ContextType, InjectablesType, true>[]
): Promise<ContextType> {
	if (controllers.length === 0 || !context.next) return context;

	const controller = controllers[0];
	const result = await controller.middleware(
		context,
		...(controller.injectables || [])
	);

	return await handleImmutableControllers(result, ...controllers.slice(1));
}

export async function subscribeRoute<
	TestType,
	ContextType extends Context,
	InjectablesType = any,
	RequestType = ContextType,
	ResponseType = RequestType
>(
	subscriber: Subscriber<TestType, RequestType, ResponseType>,
	route: Route<TestType, ContextType, InjectablesType, true>,
	contextGenerator?: Generator<RequestType, ContextType>,
	responseGenerator?: Generator<ContextType, ResponseType>
) {
	return await subscriber(route.test, async (request) => {
		const context: ContextType = contextGenerator
			? contextGenerator(request)
			: (request as any);

		return responseGenerator
			? responseGenerator(
					await handleImmutableControllers(
						context,
						...route.controllers
					)
			  )
			: (context as any);
	});
}

export type ContextedConfiguration<
	TestType,
	ContextType extends Context,
	RequestType = ContextType,
	ResponseType = RequestType
> = {
	subscriber: Subscriber<TestType, RequestType, ResponseType>;
	contextGenerator?: Generator<RequestType, ContextType>;
	responseGenerator?: Generator<ContextType, ResponseType>;
	immutableContext?: boolean;
};

export class Contexted<
	TestType,
	ContextType extends Context,
	InjectablesType = any,
	RequestType = ContextType,
	ResponseType = RequestType,
	ImmutableContext = false
> {
	private subscriber: Subscriber<TestType, RequestType, ResponseType>;
	private contextGenerator: Generator<RequestType, ContextType>;
	private responseGenerator: Generator<ContextType, ResponseType>;
	private immutableContext: boolean;

	constructor(
		configuration: ContextedConfiguration<
			TestType,
			ContextType,
			RequestType,
			ResponseType
		>
	) {
		this.subscriber = configuration.subscriber;
		this.contextGenerator = configuration.contextGenerator;
		this.responseGenerator = configuration.responseGenerator;
		this.immutableContext = configuration.immutableContext;
	}

	async subscribeRoute(
		route: Route<TestType, ContextType, InjectablesType, ImmutableContext>
	) {
		const unsubscriber = await this.subscriber(
			route.test,
			this.immutableContext
				? (request) =>
						this.immutableRequestHandler(
							request,
							...route.controllers
						)
				: (request) =>
						this.requestHandler(request, ...route.controllers)
		);

		return async () => await unsubscriber();
	}

	private async requestHandler(
		request: RequestType,
		...controllers: Controller<ContextType, InjectablesType, false>[]
	) {
		const context: ContextType = this.contextGenerator
			? this.contextGenerator(request)
			: (request as any);

		for (const controller of controllers || []) {
			await controller.middleware(
				context,
				...(controller.injectables || [])
			);

			if (!context.next) break;
		}

		return this.responseGenerator
			? this.responseGenerator(context)
			: (context as any);
	}

	private async immutableRequestHandler(
		request: RequestType,
		...controllers: Controller<ContextType, InjectablesType, true>[]
	) {
		const context: ContextType = this.contextGenerator
			? this.contextGenerator(request)
			: (request as any);

		const result = await handleImmutableControllers(
			context,
			...controllers
		);

		return this.responseGenerator
			? this.responseGenerator(result)
			: (result as any);
	}
}
