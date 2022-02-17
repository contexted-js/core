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

[**Documentation**](../README.md) > [**Concepts**](README.md) > **Transformers**

---

## Explain

### Transformers

As mentioned, Contexted is an abstract framework, which means it separates [middlewares](middlewares.md), from what triggers them. But our logic is completely based on our logic type, and it will make it tricky to change your infrastructure (Driver, Trigger, whatever). **Transformers** are simple functions that will receive an object with input type and will return another object with output type:

```ts
import type { PromiseOrValue } from '@contexted/core';

export type Transformer<InputType, OutputType> = (
	input: InputType
) => PromiseOrValue<OutputType>;
```

You can use two types of **Transformers** with Contexted, one to generate [context](contexts.md) from emitted request, and the other to generate a response from the resulting [context](contexts.md).

## Examples

JSON.stringify and JSON.parse are technically string/JSON transformer:

```ts
import type { Transformer } from '@contexted/core';

const requestTransformer: Transformer<string, JSON> = JSON.stringify;
const responseTransformer: Transformer<JSON, string> = JSON.parse;
```

But by getting a little bit closer to the real world, you'll feel the magic better:

```ts
import type { Transformer } from '@contexted/core';
import type { IncomingMessage } from 'http';

type HttpContext = {
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
	next: boolean;
};

type HttpResponse = {
	status: number;
	headers: { [key: string]: string | string[] };
	body?: string;
};

const contextTransformer: Transformer<IncomingMessage, HttpContext> = (request) =>
	{
		request: {
			route: request.url,
			method: request.method,
			body: request.body,
		},
		response: { status: 404 },
		next: true
	};

const responseTransformer: Transformer<HttpContext, HttpResponse> = (context) =>
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
[Traverser](traverser.md)
