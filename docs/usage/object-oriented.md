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

[**Documentation**](../) > [**Usage**](README.md) > **Object Oreinted**

---

## Explain

Exported registerRoute is wrapped in a helper class as well. It asks for a subcriber and optinal generators to keep and use them for registerRoute function:

```ts
type UnsubscribeFunction = () => boolean | Promise<boolean>;

type ContextedConfiguration<Test, Context, Request, Response> = {
	subscriber: Subscriber<Test, Request, Response>;
	contextGenerator?: Generator<Request, Context>;
	responseGenerator?: Generator<Context, Response>;
};

class Contexted<Test, Context, Injectables, Request, Response> {
	constructor(
		private configuration: ContextedConfiguration<
			Test,
			Context,
			Request,
			Response
		>
	): void;

	registerRoute(
		route: Route<Test, Context, Injectables>
	): UnsubscribeFunction;
}
```

## Examples

Piece of cake:

```ts
import { Contexted } from '@Contexted/Core';

const application = new Contexted({
	subscriber,
	contextGenerator,
	responseGenerator,
});

const unsubscriber = application.registerRoute(route);
```

Another example with a constructed driver and without a context generator:

```ts
import { Contexted } from '@Contexted/Core';

const driver = new CustomDriver();

const application = new Contexted({
	subscriber: (test, handler) => driver.subscribe(test, handler),
	null,
	responseGenerator,
});

application.registerRoute(route);
```
