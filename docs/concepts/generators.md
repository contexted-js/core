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

[**Documentation**](../) > [**Concepts**](README.md) > **Generators**

---

## Explain

## Generators

Contexted is an abstract framework, which means it seprates middlewares, from what triggers them. But our logic is complitly based on our logic type, and it will make it tricky to change you infrastructure (Driver, Trigger, whatever). Generators are dead simple functions that will recive an object with input type, and will return another object with output type:

```ts
type Generator<InputType, TargetType> = (
	input: InputType
) => AsyncReturn<TargetType>;
```

Contexted will ask you for two generators, to generate context from request, and response from context.

### Context Generator

```ts
type ContextGenerator = Generator<Reqest, Context>;
```

### Response Generator

```ts
type ContextGenerator = Generator<Context, Response>;
```

## Examples

JSON.stringify and JSON.parse are basically string/JSON generators:

```ts
const contextGenerator: Generator<string, JSON> = JSON.stringify;
const responseGenerator: Generator<JSON, string> = JSON.parse;
```

But by getting a little bit closer to real world, you'll feel the magic better:

```ts
import { IncomingMessage } from 'http';

type CustomContext = {
	readonly request: {
		route: string;
		method: string;
		body: any;
	};
	response: {
		status: number;
		mime?: string;
		body?: string;
	};
};

type CustomResponse = {
	status: number;
	headers: { [key: string]: string | string[] };
	body?: string;
};

const contextGenerator = (request: IncomingMessage) =>
	<CustomContext>{
		request: {
			route: request.url,
			method: request.method,
			body: request.body,
		},
		response: { status: 404 },
	};

const responseGenerator = (context: CustomContext) =>
	<CustomResponse>{
		status: context.response.status,
		headers: [{ 'Content-Type': context.response.mime }],
		body: context.response.body,
	};
```
