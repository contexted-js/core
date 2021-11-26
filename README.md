<div align="center">
    <img width="128" src="https://raw.githubusercontent.com/contexted-js/brand/master/dark/main.svg">
    <br />
    <br />
    <a href="https://github.com/contexted-js/core">
        <h1>@Contexted/Core</h1>
    </a>
  <p>
    Modular TypeScript application framework.<br />
    With plugable drivers, generic types and simple context based architecture, you can build almost any application.
  </p>
</div>

## Table of Contents

- [Introduction](#introduction)
    - [Overview](#overview)
    - [Summary](#summary)
- [Concepts](#concepts)
    - [Middleware](#middleware)
	- [Context and Response Generator](#context-and-response-generator)
    - [Subscriber](#subscriber)
    - [Route](#route)
- [Usage](#usage)
    - [OOP](#oop)
- [API Reference](#api-reference)
    - [Types](#types)
    - [Constructors](#constructors)

## Introduction

### Overview

Contexted is an abstract application framework that uses a simple context-based architecture. You can use any driver (NodeJS, STD, JavaScript, Native App Frameworks, etc), any request to context, and context to response transformer and use their generic types to separate infrastructure from logic and build cross-environment middlewares.

### Summary

-   You will subscribe **Middlewares** to a custom driver with a **Subscribe Function**.
-   Your driver will make a request with **Request Type** when the test passes.
-   **Context Generator** will convert **Request Type** to **Context Type**.
-   **Middlewares** will receive **Context** and **Injectables** in sequence.
-   Final result of **Middleware** will be converted from **Context Type** to **Response Type** by **Response Generator** and will be returned to driver.

## Concepts

### Middleware

A function that receives a context and a set of injectables, and is expected to return another context.

Example:

```ts
type CustomContext = {
	readonly request: string;
	response: string[];
};

const customMiddleware = (context: CustomContext, injectedDate: Date) => {
	context.response.push(injectedDate, context.request);
	return context;
};
```

### Context/Response Generator

Functions that will generate context wit request, or response with context.

Example:

```ts
type CustomRequest = string;
type CustomResponse = string[];

type CustomContext = {
	readonly request: string;
	response: string[];
};

const customContextGenerator = (request: CustomRequest) =>
	<CustomContext>{
		request,
		response: [],
	};

const customResponseGenerator = (context: CustomContext) =>
	<CustomResponse>context.response;
```

### Subscriber

Subscriber registers given test case and an array of middlewares to a driver.

Example:

```ts
type CustomTest = RegExp;
type CustomRequest = string;
type CustomResponse = string[];

class CustomDriver {
	private subscribers: {
		[test: CustomTest]: (request: CustomRequest) => Promise<CustomResponse>;
	};

	constructor() {
		this.subscribers = {};
	}

	subscribe(
		test: CustomTest,
		handler: (request: CustomRequest) => Promise<CustomResponse>
	) {
		if (this.subscribers[test]) return;

		this.subscribers[test] = handler;

		return () => {
			if (!this.subscribers[test]) return false;

			delete this.subscribers[test];

			return true;
		};
	}

	async emit(route: CustomTest, data: CustomRequest) {
		for (const [test, handler] of Object.entries(this.subscribers))
			if (route === test) return await handler(data);

		return null;
	}
}
```

### Route

A Route is a object with test case and a middleware stream.

Example:

```ts
const customRoute = {
	test: /custom:route/,
	middlewares: [{
		middleware: customMiddleware,
		injectables: [new Date()]
	}]
};
```

## Usage

### OOP

Contexted exports a class. You can construct it with custom driver and generators and works more easily with routes.

Example:

```ts
import { Contexted } from '@Contexted/Core';

const customDriver = new CustomDriver();

const application = new Contexted({
	subscriber: (test, handler) => customDriver.subscribe(test, handler),
	customContextGenerator,
	customResponseGenerator,
});

const customRouteUnsubscribeFunction = application.registerRoute(customRoute);
```

## API Reference

### Types

```ts
type AsyncReturn<ReturnType> = ReturnType | Promise<ReturnType>;

type ContextTransformer<InputType, TargetType> = (
	input: InputType
) => AsyncReturn<TargetType>;

type Middlware<Context, Injectables> = (
	context: Context,
	...injectables: Injectables[]
) => AsyncReturn<Context>;

type Route<Test, Context, Injectables> = {
	test: Test;
	middlewares: {
		middleware: Middlware<Context, Injectables>;
		injectables?: Injectables[];
	}[];
};

type Subscriber<Test, Request, Response> = (
	test: Test,
	handler: (request: Request) => AsyncReturn<Response>
) => () => AsyncReturn<boolean>;

type ContextedConfiguration<TestType, ContextType, RequestType, ResponseType> =
	{
		subscriber: Subscriber<TestType, RequestType, ResponseType>;
		contextGenerator?: ContextTransformer<RequestType, ContextType>;
		responseGenerator?: ContextTransformer<ContextType, ResponseType>;
	};
```

### Constructors

```ts
class Contexted<
	TestType,
	ContextType,
	InjectablesType,
	RequestType,
	ResponseType
> {
	constructor(
		private configuration: ContextedConfiguration<
			TestType,
			ContextType,
			RequestType,
			ResponseType
		>
	): void;

	registerRoute(
		route: Route<TestType, ContextType, InjectablesType>
	): Function;
}
```
