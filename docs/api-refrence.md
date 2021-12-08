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

type Context = { next: boolean };

type Middleware<
	MiddlewareContext extends Context,
	Injectables = any,
	ImmutableContext = false
> = (
	context: MiddlewareContext,
	...injectables: Injectables[]
) => AsyncReturn<ImmutableContext extends true ? MiddlewareContext : any>;

type Controller<
	MiddlewareContext extends Context,
	Injectables = any,
	ImmutableContext = false
> = {
	middleware: Middleware<MiddlewareContext, Injectables, ImmutableContext>;
	injectables?: Injectables[];
};

type Route<
	Test,
	MiddlewareContext extends Context,
	Injectables = any,
	ImmutableContext = false
> = {
	test: Test;
	controllers: Controller<MiddlewareContext, Injectables, ImmutableContext>[];
};

type UnsubscribeFunction = () => AsyncReturn<boolean>;

type SubscriberHandler<Request, Response = Request> = (
	request: Request
) => AsyncReturn<Response>;

type Subscriber<Test, Request, Response = Request> = (
	test: Test,
	handler: SubscriberHandler<Request, Response>
) => AsyncReturn<UnsubscribeFunction>;

type Generator<Input, Output> = (input: Input) => AsyncReturn<Output>;

type ContextedConfiguration<
	Test,
	MiddlewareContext extends Context,
	Request = MiddlewareContext,
	Response = Request
> = {
	subscriber: Subscriber<Test, Request, Response>;
	contextGenerator?: ContextTransformer<Request, MiddlewareContext>;
	responseGenerator?: ContextTransformer<MiddlewareContext, Response>;
	immutableContext?: boolean;
};
```

## Methods

```ts
async function subscribeRoute<
	Test,
	MiddlewareContext extends Context,
	Injectables = any,
	Request = MiddlewareContext,
	Response = Request
>(
	subscriber: Subscriber<Test, Request, Response>,
	route: Route<Test, MiddlewareContext, Injectables, true>,
	contextGenerator?: Generator<Request, MiddlewareContext>,
	responseGenerator?: Generator<MiddlewareContext, Response>
): Promise<UnsubscribeFunction>;
```

## Constructors

```ts
class Contexted<
	Test,
	MiddlewareContext extends Context,
	Injectables = any,
	Request = MiddlewareContext,
	Response = Request,
	ImmutableContext = false
> {
	constructor(
		private configuration: ContextedConfiguration<
			Test,
			MiddlewareContext,
			Request,
			Response
		>
	): void;

	registerRoute(
		route: Route<Test, MiddlewareContext, Injectables, ImmutableContext>
	): UnsubscribeFunction;
}
```

< Prev Page
[Object Oriented](usage/object-oriented.md)
