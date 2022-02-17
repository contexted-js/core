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

[**Documentation**](../README.md) > [**Concepts**](README.md) > **Routes**

---

## Explain

### Controller

As mentioned in the [Middlewares](middlewares.md) section, they can receive injectables. An object containing a middleware and objects to be injected is called a **Controller**:

```ts
type Controller<Context, Injectables, IsImmutable extends boolean> = {
	middleware: Middleware<Context, Injectables, IsImmutable>;
	injectables?: Injectables[];
};
```

### Routes

A `Route` is an object that shows which controllers should be executed when which test case happens:

```ts
type Route<Test, Context, Injectables, IsImmutable extends boolean> = {
	test: Test;
	controllers: Controller<MiddlewareContext, Injectables, IsImmutable>[];
};
```

## Examples

Here's a very simple route, which only has one middleware, without any injectables:

```ts
import type { EchoContext } from 'your-code';
import { echoMiddleware as middleware } from 'your-code';

const echoController: Controller<EchoContext> = { middleware };
const echoRoute = {
	test: 'echo',
	controllers: [echoController],
};
```

But this one is a bit more realistic example:

```ts
import type {
	Test,
	Context,
	AuthGuard,
	DatabaseService,
	ContentCreateBodyScheme,
} from 'your-code';

import {
	databaseService,
	contentCreateBodyScheme,
	authGuardMiddleware,
	bodyParserMiddleware,
	bodyValidatorMiddleware,
	addContentMiddleware,
	apiResponseGeneratorMiddleware,
	logMiddleware,
} from 'your-code';

const createContentRoute: Route<
	Test,
	Context,
	AuthGuard | DatabaseService | ContentCreateBodyScheme,
	true
> = {
	test: {
		path: '/api/content',
		method: 'POST',
	},
	controllers: [
		{
			middleware: authGuardMiddleware,
			injectables: [databaseService],
		},
		{ middleware: bodyParserMiddleware },
		{
			middleware: bodyValidatorMiddleware,
			injectables: [contentCreateBodyScheme],
		},
		{
			middleware: addContentMiddleware,
			injectables: [databaseService],
		},
		{ middleware: apiResponseGeneratorMiddleware },
		{ middleware: logMiddleware },
	],
};
```

---

< Prev Page
[Middlewares](middlewares.md)

Next Page >
[Transformers](transformers.md)
