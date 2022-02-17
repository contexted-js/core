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

[**Documentation**](../README.md) > [**Concepts**](README.md) > **Contexts**

---

## Explain

### Contexts

Simply put, a **Context** is a state-holder data unit. Originally, the concept was defined to be used for old fashion state handling, like saving data while an interruption is happening, but (as Contexted uses them), they are state objects shared between different data processors (aka [Middlewares](middlewares.md)).

## Examples

Unrealistic dead-simple example:

```ts
type Context = { content: string };

const context: Context = { content: 'request' };
```

Better example:

```ts
type Request = {
	readonly url: string;
	readonly method: string;
	readonly body?: Buffer;
};

type Response = {
	status: number;
	mime?: string;
	body?: any;
};

type HttpContext = {
	readonly request: Request;
	response: Response;
	next: boolean;
};

const context: HttpContext = {
	request: {
		url: '/',
		method: 'GET',
	},
	response: { status: 404 },
	next: true,
};
```

---

< Prev Page
[Concepts](README.md)

Next Page >
[Middlewares](middlewares.md)
