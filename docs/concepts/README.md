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

[**Documentation**](../) > **Concepts**

---

## Architecture

Contexted is similar to any other middleware-based application framework, with an amazing difference. By using two generators that convert requests to contexts, and contexts to responses, you can separate your infrastructure and app logic. So, migrating to another infrastructure, maintaining the existing one, and reusing all of your modules (drivers and subscribers, generators, middlewares) in other projects, are unbelievably easy.

-   You subscribe a set of **Middleware** functions and **Injectable** objects with a **Test Case** to a custom emitter, using a **Subscriber** function.
-   Whenever your driver meets that case, it creates a **Request**.
-   **Context Generator** function will recive request, and generates a **Context** object.
-   **Middlewares** will receive **Context** and optional **Injectable** objects in sequence.
-   Last context generated will be converted to a **Response** object by a **Response Generator** function and will be returned to driver.

## Definitions

-   [Middlewares](middlewares.md)
-   [Routes](routes.md)
-   [Generators](generators.md)
-   [Subscribers](subscribers.md)
