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

[**Documentation**](../README.md) > [**Usage**](README.md) > **Functional**

---

## Explain

Contexted exports a function named `subscribeRoute`. It generates a handler function and subscribes using provided subscriber:

```ts
import type { Context, Subscriber, Route, Generator } from '@contexted/core';

type UnsubscribeFunction = () => boolean | Promise<boolean>;

function subscribeRoute<
	Test,
	MiddlewareContext extends Context,
	Injectables = any,
	Request = Context,
	Response = Request,
	ImmutableContext = false
>(
	subscriber: Subscriber<Test, Request, Response>,
	route: Route<Test, MiddlewareContext, Injectables, true>,
	contextGenerator?: Generator<Request, MiddlewareContext>,
	responseGenerator?: Generator<MiddlewareContext, Response>,
	immutableContext = false
): UnsubscribeFunction;
```

`subscribeRoute` function is designed to be used with [context immutable middlewares](../concepts/middlewares.md#context-immutable-middlewares). But you can change this behavior by changing the immutableContext flag to false.

Also If you don't provide any generators, an echo generator will be used instead:

```ts
const echoGenerator: Generator<Input, Output> = (input: Input) => input as any;
```

## Examples

Pretty straightforward:

```ts
import { subscribeRoute } from '@contexted/core';

import {
	subscriber,
	immutableContextRoute,
	contextGenerator,
	responseGenerator,
} from './your-code';

const unsubscriber = subscribeRoute(
	subscriber,
	immutableContextRoute,
	contextGenerator,
	responseGenerator
);
```

This example uses mutable contexts and no generators:

```ts
import { subscribeRoute } from '@contexted/core';

import { subscriber, mutableContextRoute } from './your-code';

const unsubscriber = subscribeRoute(
	subscriber,
	mutableContextRoute,
	null,
	null,
	false
);
```

---

< Prev Page
[Usage](README.md)

Next Page >
[Object Oriented](object-oriented.md)
