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

[**Documentation**](../README.md) > [**Concepts**](README.md) > **Generators**

---

## Explain

### Generators

Contexted is an abstract framework, which means it separates middlewares, from what triggers them. But our logic is completely based on our logic type, and it will make it tricky to change your infrastructure (Driver, Trigger, whatever). `Generator`s are simple functions that will receive an object with input type and will return another object with output type:

```ts
type Generator<InputType, TargetType> = (
	input: InputType
) => TargetType | Promise<TargetType>;
```

You can use two types of `Generator`s with Contexted, one to generate context from request, and the other to generate a response from the context.

## Examples

JSON.stringify and JSON.parse are technically string/JSON generators:

```ts
import type { Generator } from '@contexted/core';

const contextGenerator: Generator<string, JSON> = JSON.stringify;
const responseGenerator: Generator<JSON, string> = JSON.parse;
```

But by getting a little bit closer to the real world, you'll feel the magic better:

```ts
import type { Context, Generator } from '@contexted/core';
import type { IncomingMessage } from 'http';

type HttpContext = Context & {
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

type HttpResponse = {
	status: number;
	headers: { [key: string]: string | string[] };
	body?: string;
};

const contextGenerator: Generator<IncomingMessage, HttpContext> = (request) =>
	{
		request: {
			route: request.url,
			method: request.method,
			body: request.body,
		},
		response: { status: 404 },
	};

const responseGenerator: Generator<HttpContext, HttpResponse> = (context) =>
	{
		status: context.response.status,
		headers: [{ 'Content-Type': context.response.mime }],
		body: context.response.body,
	};
```

---

< Prev Page
[Routes](routes.md)

Next Page >
[Subscribers](subscribers.md)
