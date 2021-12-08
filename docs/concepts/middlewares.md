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

Middlewares are the very basic logic units of a Contexted application.

A `Middleware` is an asynchronous or synchronous function that receives a context and may receive a set of injected objects, and will be used to process the context:

```ts
import type { AsyncReturn, Context } from '@contexted/core';

type Middleware<
	MiddlewareContext extends Context,
	Injectables = any,
	ImmutableContext = false
> = (
	context: MiddlewareContext,
	...injectables: Injectables[]
) => AsyncReturn<ImmutableContext extends true ? ContextType : any>;
```

### Mutability

As mentioned in [Wikipedia](https://en.wikipedia.org/wiki/Immutable_object), an immutable object (unchangeable object) is an object whose state cannot be modified after it is created. Contexted middlewares support optional context immutability.

### Context Mutable Middlewares

When using context mutable middlewares, you make changes to your context and the same changed object will be passed to the next middleware (If the `next` flag is not `false` of course :D) and any returned value by middleware will be ignored by Contexted.

### Context Immutable Middlewares

Context immutable middlewares, on the other hand, are expected to return a context object. The returned object will be passed to the next middleware.

## Examples

First, let's look at this simple reverse middleware:

```ts
import type { Middleware } from '@contexted/core';

type Context = {
	content: string;
	next: boolean;
};

function mutableReverseMiddleware(context): Middleware<Context> {
	context.content = context.content.split('').reverse().join('');
}

function immutableReverseMiddleware(context): Middleware<Context, never, true> {
	context.content = context.content.split('').reverse().join('');
	return context;
}
```

Now by using a more complex context structure, you can separate your input/output data:

```ts
import type { Middleware, Context } from '@contexted/core';

type StringContext = Context & {
	readonly request: string;
	response: string;
};

const mutableReverseMiddleware: Middleware<StringContext> = (context) =>
	(context.response = request.split('').reverse().join(''));

const immutableReverseMiddleware: Middleware<Context, never, true> = ({
	request,
	response,
}) => ({
	request,
	response: request.split('').reverse().join(''),
	next: true,
});
```

This simple login server example gives you a more realistic view of middlewares in action. Notice the `next` flag:

```ts
import type { Context, Middleware } from '@contexted/core';

import type { DatabaseService } from './your-code';

type HttpContext = Context & {
	readonly request: {
		route: string;
		method: string;
		body: any;
	};
	response: {
		status: number;
		headers?: { [tag: string]: string[] };
		body?: string;
	};
};

const mutableLoginMiddleware: Middleware<HttpContext, DatabaseService> = (
	context,
	$database
) => {
	const user = $database.get(context.request.body?.username);

	if (!user) {
		context.response.status = 404;
		context.response.body = 'user not found';
		context.next = false;
	} else {
		context.response.status = 200;
		context.response.headers = { 'Content-Type': 'application/json' };
		context.response.body = JSON.stringify({ user });
	}
};

const immutableLoginMiddleware: Middleware<HttpContext, DatabaseService, true> =
	({ request }, $database) => {
		const user = $database.get(request.body?.username);

		return {
			request,
			response: user
				? {
						status: 200,
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ user }),
				  }
				: {
						status: 404,
						body: 'user not found',
				  },
			next: user ? true : false,
		};
	};
```

---

< Prev Page
[Contexts](contexts.md)

Next Page >
[Routes](routes.md)
