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

[**Documentation**](../) > [**Concepts**](README.md) > **Routes**

---

## Explain

### Streams

Streams are an array of middlewares, with their required injectable objects:

```ts
type Stream<Context, Injectables = never> = {
	middleware: Middleware<Context, Injectables>;
	injectables?: Injectables[];
}[];
```

### Routes

**Routes** are objects that define which steam should be executed when which test case happens:

```ts
type Route<Test, Context, Injectables = never> = {
	test: Test;
	middlewares: Stream<Context, Injectables>;
};
```

## Examples

Here's a very simple route, which only has one middleware, without any injectables:

```ts
const echoStream = [{ middleware: echoMiddleware }];
const echoRoute = {
    test: 'echo',
    middlewares: echoStream
}
```

But this one is a bit more realistic example:

```ts
const createContentRoute = {
	test: {
		path: '/api/content',
		method: 'POST',
	},
	middlewares: [
		{
			middleware: authGuard,
			injectables: [databaseService],
		},
		{ middleware: bodyParser },
		{
			middleware: bodyValidator,
			injectables: [contentCreateBodyScheme],
		},
		{
			middleware: addContent,
			injectables: [databaseService],
		},
		{ middleware: apiResponseGenerator },
		{ middleware: logService },
	],
};
```
