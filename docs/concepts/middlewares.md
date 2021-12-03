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

[**Documentation**](../) > [**Concepts**](README.md) > **Middleware**

---

## Explain

### Contexts

Simply put, contexts are state-holder data units. Originally, the concept was defined to be used for old fashion state handling, like saving data while an interruption is happening, but (as Contexted uses them), they can also be shared between different data processors.

### Middlewares

Middlewares, small software units that will make your project work, are the very basic logic units of a Contexted application.<br />
A middleware is a function that receives a context, and may receive a set of injected objects, and is expected to return a context with the same type as input context:

```ts
type Middlware<Context, Injectables> = (
	context: Context,
	...injectables: Injectables[]
) => Context | Promise<Context>;
```

## Examples

This is a simple echo middleware:

```ts
function echoMiddleware(context: string) {
	return context;
}
```

Which we also know as:

```ts
echoMiddleware = (context: string) => context;
```

bby using a more complex context structure, you can seprate your input/output data:

```ts
type CustomContext = {
	readonly request: string;
	response: string;
};

const reverseMiddleware = (context: CustomContext) => ({
	request: context.request,
	response: context.request.split('').reverse().join(''),
});
```

Following example - a simple login server - gives you a more realistic view on middlewares in action:

```ts
interface CustomDatabaseService {
	get: (key: string) => string;
}

type CustomContext = {
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

const loginMiddleware = (
	context: CustomContext,
	$database: CustomDatabaseService
) => {
	const user = $database.get(context.request.body?.username);

	if (!user) {
		context.response.status = 404;
		context.response.body = 'user not found';
	} else {
		context.response.status = 200;
		context.response.headers = { 'Content-Type': 'application/json' };
		context.response.body = JSON.stringify({ user });
	}

	return context;
};
```
