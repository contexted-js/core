export type AsyncReturn<ReturnType> = ReturnType | Promise<ReturnType>;

export type Middlware<ContextType, InjectablesType> = (
	context: ContextType,
	...injectables: InjectablesType[]
) => AsyncReturn<ContextType>;

export type Generator<InputType, TargetType> = (
	input: InputType
) => AsyncReturn<TargetType>;

export type Route<TestType, ContextType, InjectablesType> = {
	test: TestType;
	middlewares: {
		middleware: Middlware<ContextType, InjectablesType>;
		injectables?: InjectablesType[];
	}[];
};

export type Subscriber<TestType, RequestType, ResponseType> = (
	test: TestType,
	handler: (request: RequestType) => AsyncReturn<ResponseType>
) => () => AsyncReturn<boolean>;

export function registerRoute<
	TestType,
	ContextType,
	InjectablesType,
	RequestType,
	ResponseType
>(
	subscriber: Subscriber<TestType, RequestType, ResponseType>,
	route: Route<TestType, ContextType, InjectablesType>,
	contextGenerator: Generator<RequestType, ContextType>,
	responseGenerator: Generator<ContextType, ResponseType>
) {
	return subscriber(route.test, async (request) => {
		try {
			let context = await contextGenerator(request);

			for (const middleware of route.middlewares)
				context = await middleware.middleware(
					context,
					...(middleware.injectables || [])
				);

			return await responseGenerator(context);
		} catch (error) {
			throw error;
		}
	});
}

export type ContextedConfiguration<
	TestType,
	ContextType,
	RequestType,
	ResponseType
> = {
	subscriber: Subscriber<TestType, RequestType, ResponseType>;
	contextGenerator?: Generator<RequestType, ContextType>;
	responseGenerator?: Generator<ContextType, ResponseType>;
};

export class Contexted<
	TestType,
	ContextType,
	InjectablesType,
	RequestType,
	ResponseType
> {
	constructor(
		private configuration: ContextedConfiguration<
			TestType,
			ContextType,
			RequestType,
			ResponseType
		>
	) {
		this.configuration.contextGenerator ||= (request) => request as any;
		this.configuration.responseGenerator ||= (context) => context as any;
	}

	registerRoute(route: Route<TestType, ContextType, InjectablesType>) {
		return registerRoute(
			this.configuration.subscriber,
			route,
			this.configuration.contextGenerator,
			this.configuration.responseGenerator
		);
	}
}
