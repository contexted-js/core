<div align="center">
    <img width="128" src="https://raw.githubusercontent.com/contexted-js/brand/master/dark/main.svg">
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

Exported registerRoute is wrapped in a helper class as well:

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
    responseGenerator
});

const unsubscriber = application.registerRoute(route);
```
