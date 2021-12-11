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

[**Documentation**](../README.md) > [**Usage**](README.md) > **Object Oreinted**

---

## Explain

Contexted constructor asks for subscriber and optional generators and will keep and use them for route subscriptions:

```ts
type UnsubscribeFunction = () => boolean | Promise<boolean>;

type ContextedConfiguration<
	Test,
	MiddlewareContext extends Context,
	Request = MiddlewareContext,
	Response = Request
> = {
	subscriber: Subscriber<Test, Request, Response>;
	contextGenerator?: Generator<Request, Context>;
	responseGenerator?: Generator<Context, Response>;
	immutableContext?: boolean;
};

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

Unlike the `subscribeRoute` function, `Contexted` class uses [context mutable middlewares](../concepts/middlewares.md#context-mutable-middlewares) by default. In order to use [context immutable middlewares](../concepts/middlewares.md#context-immutable-middlewares), you should set `immutableContext` flag in your configuration to true.

## Examples

Piece of cake:

```ts
import { Contexted } from '@contexted/core';

import {
	subscriber,
	contextGenerator,
	responseGenerator,
	mutableContextRoute,
} from './your-code';

const application = new Contexted({
	subscriber,
	contextGenerator,
	responseGenerator,
});

const unsubscriber = await application.subscribeRoute(mutableContextRoute);
```

Another example with a constructed driver, without a context generator and using immutable contexts:

```ts
import { Contexted } from '@contexted/core';

import {
	Driver,
	contextGenerator,
	responseGenerator,
	immutableContextRoute,
} from './your-code';

const driver = new Driver();

const application = new Contexted({
	subscriber: (test, handler) => driver.subscribe(test, handler),
	null,
	responseGenerator,
	true,
});

const unsubscriber = await application.subscribeRoute(immutableContextRoute);
```

---

< Prev Page
[Functional](functional.md)

Next Page >
[API Refrence](../api-refrence.md)
