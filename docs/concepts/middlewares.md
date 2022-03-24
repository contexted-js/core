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

[**Documentation**](../README.md) > [**Concepts**](README.md) > **Middleware**

---

## Explain

### Middlewares

Middlewares are the very basic logic units of a **Contexted** application.

A **middleware** is an asynchronous or synchronous function that receives a [context](contexts.md) and may receive a set of injected objects, and will be used to process the **context**.

Notice `IsImmutable` generic, which indicates your **contexts** are [immutable](https://en.wikipedia.org/wiki/Immutable_object) or not. If you are using **immutable** **contexts**, the **middleware** should return the resulting **context**.

```ts
import type { PromiseOrValue } from '@contexted/core';

export type Middleware<Context, Injectables, IsImmutable extends boolean> = (
	context: Context,
	...injectables: Injectables[]
) => PromiseOrValue<IsImmutable extends true ? Context : void>;
```

## Examples

First, let's look at this simple reverse middleware:

```ts
import type { Middleware } from '@contexted/core';

type Context = string;
type Injectables = never;

const mutableReverseMiddleware: Middleware<Context, Injectables, false> = (
	context
) => {
	context.content = context.content.split('').reverse().join('');
};

const immutableReverseMiddleware: Middleware<Context, Injectables, true> = (
	context
) => context.split('').reverse().join('');
```

Now by using a more complex context structure, you can separate your input/output data:

```ts
import type { Middleware } from '@contexted/core';

type Context = {
	readonly request: string;
	response: string;
};

type Injectables = never;

const mutableReverseMiddleware: Middleware<Context, Injectables, false> = (
	context
) => {
	context.response = context.request.split('').reverse().join('');
};

const immutableReverseMiddleware: Middleware<Context, Injectables, true> = (
	context
) => {
	context.response = context.request.split('').reverse().join('');
	return context;
};
```

This simple login server example gives you a more realistic view of middlewares in action. Notice the `next` flag:

```ts
import type { Middleware } from '@contexted/core';

import type { DatabaseService } from 'your-code';

type Context = {
	readonly request: {
		readonly route: string;
		readonly method: string;
		readonly body: any;
	};
	response: {
		status: number;
		headers?: { [tag: string]: string[] };
		body?: string;
	};
	next: true;
};

type Injectables = DatabaseService;

const mutableLoginMiddleware: Middleware<Context, Injectables, false> = (
	context,
	$database
) => {
	const user = $database.get(context.request.body?.username);

	context.response.status = user ? 200 : 404;
	context.response.headers = { 'Content-Type': 'application/json' };
	context.response.body = user ? { user } : { error: 'user not found' };
};

const immutableLoginMiddleware: Middleware<Context, Injectables, true> = (
	context,
	$database
) => {
	const user = $database.get(context.request.body?.username);

	return {
		request: context.request,
		response: {
			status: user ? 200 : 404,
			headers: { 'Content-Type': 'application/json' },
			body: user ? { user } : { error: 'user not found' },
		},
		next: true,
	};
};
```

---

< Prev Page
[Contexts](contexts.md)

Next Page >
[Routes](routes.md)
