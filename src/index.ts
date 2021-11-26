export type AsyncReturn<ReturnType> = ReturnType | Promise<ReturnType>;

export type Middlware<ContextType, InjectablesType> = (
	context: ContextType,
	...injectables: InjectablesType[]
) => AsyncReturn<ContextType>;

export type ContextTransformer<InputType, TargetType> = (
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

export type ContextedConfiguration<
	TestType,
	ContextType,
	RequestType,
	ResponseType
> = {
	subscriber: Subscriber<TestType, RequestType, ResponseType>;
	contextGenerator?: ContextTransformer<RequestType, ContextType>;
	responseGenerator?: ContextTransformer<ContextType, ResponseType>;
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
		return this.configuration.subscriber(route.test, async (request) => {
			try {
				let context = await this.configuration.contextGenerator(request);
	
				for (const middleware of route.middlewares)
					context = await middleware.middleware(
						context,
						...(middleware.injectables || [])
					);
	
				return await this.configuration.responseGenerator(context);
			} catch (error) {
				throw error;
			}
		});
	}
}
