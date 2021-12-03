<div align="center">
    <img alt="Contexted Logo" width="64" src="https://raw.githubusercontent.com/contexted-js/brand/master/dark/main-fill.svg">
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

[**Documentation**](../) > [**Usage**](README.md) > **Functional**

---

## Explain

Contexted exports a function named registerRoute. It generates a handler function, and subscribes it:

```ts
type UnsubscribeFunction = () => boolean | Promise<boolean>;

function registerRoute<Test, Context, Injectables, Request, Response>(
	subscriber: Subscriber<Test, Request, Response>,
	route: Route<Test, Context, Injectables>,
	contextGenerator?: Generator<Request, Context>,
	responseGenerator?: Generator<Context, Response>
): UnsubscribeFunction;
```

If you don't provide any generators, it'll just use an echo generator instead:

```ts
const echoGenerator: Generator<Input, Output> = (input: Input) => input as any;
```

## Examples

Pretty straightforward:

```ts
import { registerRoute } from '@Contexted/Core';

const unsubscriber = registerRoute(
	subscriber,
	route,
	contextGenerator,
	responseGenerator
);
```
