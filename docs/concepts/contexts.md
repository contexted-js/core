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

Simply put, a `Context` is a state-holder data unit. Originally, the concept was defined to be used for old fashion state handling, like saving data while an interruption is happening, but (as Contexted uses them), they can also be shared between different data processors.

Contexted `Context`s are mutable and always should have a `next` boolean attribute to indicate whether to run the next middleware or not:

```ts
type Context = { next: boolean };
```

## Examples

Unrealistic dead-simple example:

```ts
const context = {
	content: null,
	next: true,
};
```

Better example:

```ts
import type { Context } from '@contexted/core';

type CliContext = Context & {
	readonly request: string;
	response: string[];
};

const context: CliContext = {
	request: 'run command --argA --argB',
	response: [],
	next: true,
};
```

---

< Prev Page
[Concepts](README.md)

Next Page >
[Middlewares](middlewares.md)
