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

**Contexted** exports a constructor, which asks for a [subscriber](../concepts/subscribers.md), a [traverser](../concepts/traverser.md), and request or response [transformers](../concepts/transformers.md), and will keep and use them for route subscriptions:

```ts
import type { Subscriber, Unsubscriber, Transformer, Traverser } from '@contexted/core';

export type Configuration<
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

export class Contexted<
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
	);

	async subscribeRoute(
		route: Route<Test, Context, Injectables, IsImmutable>
	): Promise<Unsubscriber>;
}
```

## Examples

Piece of cake:

```ts
import type { Test, Context, Injectables, Request, Response } from 'your-code';

import { Contexted } from '@contexted/core';

import {
	subscriber,
	traverser,
	requestTransformer,
	responseTransformer,
	mutableContextRoute,
} from 'your-code';

const application = new Contexted<
	Test,
	Context,
	Injectables,
	Request,
	Response,
	false
>({
	subscriber,
	traverser,
	requestTransformer,
	responseTransformer,
});

const unsubscriber = await application.subscribeRoute(mutableContextRoute);
```

Another example with a constructed driver, without a request transformers and using immutable contexts:

```ts
import type { Test, Context, Injectables, Request, Response } from 'your-code';

import { Contexted } from '@contexted/core';

import {
	subscriber,
	traverser,
	responseTransformer,
	immutableContextRoute,
} from 'your-code';

const driver = new Driver();

const application = new Contexted<
	Test,
	Context,
	Injectables,
	Request,
	Response,
	true
>({
	subscriber: (test, handler) => driver.subscribe(test, handler),
	traverser,
	responseTransformer,
});

const unsubscriber = await application.subscribeRoute(immutableContextRoute);
```

---

< Prev Page
[Usage](README.md)

Next Page >
[Functional](functional.md)
