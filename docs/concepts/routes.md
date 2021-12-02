<div align="center">
    <img width="128" src="https://raw.githubusercontent.com/contexted-js/brand/master/dark/main.svg">
    <br />
    <br />
    <h1>
		<a href="https://github.com/contexted-js/core">
        	@Contexted/Core
    	</a>
		<span>Documentations</span>
	</h1>
</div>

<img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/contexted-js/core">

---

[**Documentation**](../../) > [**Concepts**](../) > **Routes**

---

## Explain

### Routes

**Routes** are objects that define what middlewares should be executed, injected with what objects, and when what test case happens:

```ts
type Route<Test, Context, Injectables> = {
	test: Test;
	middlewares: {
		middleware: Middlware<Context, Injectables>;
		injectables?: Injectables[];
	}[];
};
```

## Examples

Here's a very simple route, which only has one middleware, without any injectables:

```ts
const echoRoute = {
    test: 'echo',
    middlewares: [{ middleware: echoMiddleware }]
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
