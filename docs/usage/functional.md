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

[**Documentation**](../README.md) > [**Usage**](README.md) > **Functional**

---

## Explain

Contexted exports a function named **createContextedInstance**. It constructs a **Contexted** instance for functional usage:

```ts
export function createContextedInstance<
	Test,
	Context,
	Injectables,
	Request,
	Response,
	IsImmutable extends boolean
>(
	configuration: Configuration<
		Test,
		Context,
		Injectables,
		Request,
		Response,
		IsImmutable
	>
): Contexted<Test, Context, Injectables, Request, Response, IsImmutable>;
```

## Examples

Pretty straightforward:

```ts
import { createContextedInstance } from '@contexted/core';

import {
	subscriber,
	traverser,
	requestTransformer,
	responseTransformer,
	immutableContextRoute,
} from 'your-code';

const application = createContextedInstance(
	subscriber,
	traverser,
	requestTransformer,
	responseTransformer
);

const unsubscriber = await application.subscribeRoute(immutableContextRoute);
```

---

< Prev Page
[Object Oriented](object-oriented.md)

Next Page >
[API Refrence](../api-refrence.md)
