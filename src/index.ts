export type AsyncReturn<ReturnType> = ReturnType | Promise<ReturnType>;

export type Middlware<ContextType, InjectablesType = never> = (
	context: ContextType,
	...injectables: InjectablesType[]
) => AsyncReturn<ContextType>;

export type Generator<DataType, OutputType> = (
	input: DataType
) => AsyncReturn<OutputType>;

export type Stream<ContextType, InjectablesType = never> = {
	middleware: Middlware<ContextType, InjectablesType>;
	injectables?: InjectablesType[];
}[];

export type Route<TestType, ContextType, InjectablesType = never> = {
	test: TestType;
	middlewares: Stream<ContextType, InjectablesType>;
};

export type Subscriber<TestType, RequestType, ResponseType> = (
	test: TestType,
	handler: (request: RequestType) => AsyncReturn<ResponseType>
) => () => AsyncReturn<boolean>;

export function registerRoute<
	TestType,
	ContextType,
	InjectablesType = never,
	RequestType = ContextType,
	ResponseType = ContextType
>(
	subscriber: Subscriber<TestType, RequestType, ResponseType>,
	route: Route<TestType, ContextType, InjectablesType>,
	contextGenerator?: Generator<RequestType, ContextType>,
	responseGenerator?: Generator<ContextType, ResponseType>
) {
	return subscriber(route.test, async (request) => {
		try {
			let context = contextGenerator
				? await contextGenerator(request)
				: (request as any);

			for (const middleware of route.middlewares)
				context = await middleware.middleware(
					context,
					...(middleware.injectables || [])
				);

			return responseGenerator
				? await responseGenerator(context)
				: (context as ResponseType);
		} catch (error) {
			throw error;
		}
	});
}

export type ContextedConfiguration<
	TestType,
	ContextType,
	RequestType = ContextType,
	ResponseType = ContextType
> = {
	subscriber: Subscriber<TestType, RequestType, ResponseType>;
	contextGenerator?: Generator<RequestType, ContextType>;
	responseGenerator?: Generator<ContextType, ResponseType>;
};

export class Contexted<
	TestType,
	ContextType,
	InjectablesType = never,
	RequestType = ContextType,
	ResponseType = ContextType
> {
	constructor(
		private configuration: ContextedConfiguration<
			TestType,
			ContextType,
			RequestType,
			ResponseType
		>
	) {}

	registerRoute(route: Route<TestType, ContextType, InjectablesType>) {
		return registerRoute(
			this.configuration.subscriber,
			route,
			this.configuration.contextGenerator,
			this.configuration.responseGenerator
		);
	}
}
