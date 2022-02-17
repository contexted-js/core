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

- **Middleware** functions and **Injectable** objects with a **Test Case** will be subscribed to a custom emitter, using a **Subscriber** function.
- Whenever your emitter meets that case, it emits a **Request**.
- **Request Transformer** function will receive the request and generate a **Context** object.
- **Middlewares** will receive **Context** and optional **Injectable** objects in sequence.
- The resulting **Context** will be converted to a **Response** object by a **Response Transformer** function and will be returned to the **Emitter**.

## Definitions

-	[Contexts](contexts.md)
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
