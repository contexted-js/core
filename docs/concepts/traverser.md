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

[**Documentation**](../README.md) > [**Concepts**](README.md) > **Traverser**

---

## Explain

### Traverser

Normally, a middleware-based framework will run [middlewares](middlewares.md) in sequence, and [contexts](contexts.md) may be **mutable** or **immutable**. **Contexted** uses a **Traverser** function to decide how to use [controllers](routes.md#controller) for a certain **context**.

```ts
import type { PromiseOrValue, Controller } from '@contexted/core';

export type Traverser<Context, Injectables, IsImmutable extends boolean> = (
	context: Context,
	...controllers: Controller<Context, Injectables, IsImmutable>[]
) => PromiseOrValue<Context>;
```

## Examples

Simple sequential traverser, with mutable contexts and no injectables:

```ts
import type { Traverser } from '@contexted/core';

import type { Context } from 'your-code';

const traverser: Traverser<Context, never, false> = (
	context,
	...controllers
) => {
	for (const controller of controllers) await controller.middleware(context);
	return context;
};
```

Same sequential traverser with next flag, injectables, and immutable contexts:

```ts
import type { Traverser } from '@contexted/core';

type Context = { next: boolean };

const traverser: Traverser<Context, any, true> = (context, ...controllers) => {
	for (const controller of controllers) {
		context = await controller.middleware(
			context,
			...(controller.injectables || [])
		);

		if (!context.next) break;
	}

	return context;
};
```

---

< Prev Page
[Transformers](transformers.md)

Next Page >
[Subscribers](subscribers.md)
