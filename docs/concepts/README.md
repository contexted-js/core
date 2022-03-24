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

[**Documentation**](../README.md) > **Concepts**

---

## Architecture

Contexted is similar to any other middleware-based application framework, with an amazing difference. By using two transformers that convert requests to contexts, and contexts to responses, you can separate your infrastructure and app logic. So, migrating to another infrastructure, maintaining the existing one, and reusing all of your modules (drivers and subscribers, transformers, middlewares) in other projects, are unbelievably easy.

-   **Middleware** functions and **injectable** objects will be subscribed to a custom emitter, using a with a **test case** and a **subscriber** function.
-   Whenever your emitter meets that case, it emits a **request**.
-   **Request transformer** function will receive the **request** and generate a **context** object.
-   **Traverser** function will receive the generated **context** and subscribed **middlewares** for that route.
-   **Middlewares** will be called with the **context** and optional **injectable** objects by **traverser**.
-   The resulting **context** will be converted to a **response** object by a **response transformer** function and will be returned to the emitter.

## Definitions

-   [Contexts](contexts.md)
-   [Middlewares](middlewares.md)
-   [Routes](routes.md)
-   [Transformers](transformers.md)
-   [Traverser](traverser.md)
-   [Subscribers](subscribers.md)

---

< Prev Page
[Installation](../installation.md)

Next Page >
[Contexts](contexts.md)
