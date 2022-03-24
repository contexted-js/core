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
type PromiseOrValue<ValueType> = Promise<ValueType> | ValueType;

type Middleware<Context, Injectables, IsImmutable extends boolean> = (
	context: Context,
	...injectables: Injectables[]
) => PromiseOrValue<IsImmutable extends true ? Context : void>;

type Controller<Context, Injectables, IsImmutable extends boolean> = {
	middleware: Middleware<Context, Injectables, IsImmutable>;
	injectables?: Injectables[];
};

type Route<Test, Context, Injectables, IsImmutable extends boolean> = {
	test: Test;
	controllers: Controller<Context, Injectables, IsImmutable>[];
};

type Transformer<InputType, OutputType> = (
	input: InputType
) => PromiseOrValue<OutputType>;

type Traverser<Context, Injectables, IsImmutable extends boolean> = (
	context: Context,
	...controllers: Controller<Context, Injectables, IsImmutable>[]
) => PromiseOrValue<Context>;

type Unsubscriber = () => PromiseOrValue<void>;

type Subscriber<Test, Request, Response> = (
	test: Test,
	callback: Transformer<Request, Response>
) => PromiseOrValue<Unsubscriber>;

type Configuration<
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
```

## Constructors

```ts
class Contexted<
	Test,
	Context,
	Injectables,
	Request,
	Response,
	IsImmutable extends boolean
> {
	constructor(
		private configuration: Configuration<
			Test,
			Context,
			Injectables,
			Request,
			Response,
			IsImmutable
		>
	): void;

	async subscribeRoute(
		route: Route<Test, Context, Injectables, IsImmutable>
	): Promise<Unsubscriber>;
}
```

## Methods

```ts
function createContextedInstance<
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
): Contexted<Test, Context, Injectables, Request, Response, IsImmutable>;
```

< Prev Page
[Functional](usage/functional.md)
