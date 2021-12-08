<div align="center">
    <img alt="Contexted Logo" width="64" src="https://raw.githubusercontent.com/contexted-js/brand/master/dark/main-fill.svg">
    <h1>
		<a href="https://github.com/contexted-js/core">
        	@Contexted/Core
    	</a>
		<span>Documentations</span>
	</h1>
</div>

<img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/contexted-js/core">

---

[**Documentation**](README.md) > **API Refrence**

---

## Types

```ts
type AsyncReturn<ReturnType> = ReturnType | Promise<ReturnType>;
type UnsubscribeFunction = () => AsyncReturn<boolean>;

type Middleware<Context, Injectables> = (
	context: Context,
	...injectables: Injectables[]
) => AsyncReturn<Context>;

type Stream<ContextType, InjectablesType = never> = {
	middleware: Middleware<ContextType, InjectablesType>;
	injectables?: InjectablesType[];
}[];

type Route<Test, Context, Injectables> = {
	test: Test;
	middlewares: Stream[];
};

type Subscriber<Test, Request, Response> = (
	test: Test,
	handler: (request: Request) => AsyncReturn<Response>
) => AsyncReturn<UnsubscribeFunction>;

type Generator<InputType, TargetType> = (
	input: InputType
) => AsyncReturn<TargetType>;

type ContextedConfiguration<TestType, ContextType, RequestType, ResponseType> =
	{
		subscriber: Subscriber<TestType, RequestType, ResponseType>;
		contextGenerator?: ContextTransformer<RequestType, ContextType>;
		responseGenerator?: ContextTransformer<ContextType, ResponseType>;
		immutableContext?: boolean;
	};
```

## Constructors

```ts
class Contexted<
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
	): void;

	registerRoute(
		route: Route<TestType, ContextType, InjectablesType>
	): Function;
}
```

< Prev Page
[Object Oriented](usage/object-oriented.md)