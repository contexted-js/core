<div align="center">
    <img alt="Contexted Logo" width="64" src="https://raw.githubusercontent.com/contexted-js/brand/master/dark/main-fill.svg">
    <h1>
        <a href="https://github.com/contexted-js/core">
            @Contexted/Core
        </a>
        <span>Changelog</span>
    </h1>
</div>

-   All notable changes to the source code of this project will be documented in this file.
-   **This file does not include any changes that is not made to the source code (Tests, Logs, Documentations, Assets, etc.).**
-   The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
    and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
-   This package is under [MIT license](https://en.wikipedia.org/wiki/MIT_License)

---

## **3.0.0** - 2022-02-17

### Added

-   [Middleware Traverser](./docs/concepts/traverser.md)
-   [New usage methods](./docs/usage/README.md)

### Modified

-   **Generators** are now called [Transformer](./docs/concepts/transformers.md)

### Removed

-   Immutability flag, in favor of traversers
-   **next** flag, in favor of traversers
-   Strict **subscribeRoute** function, in favor of **createContextedInstance**

---

## **2.1.1** - 2021-12-11

### Added

-   Immutable context mode support for **subscribeRoute** function

---

## **2.0.0** - 2021-12-08

### Added

-   Context parent type
-   Control whether the next middleware runs using a **next** flag
-   Optional immutability for contexts
-   Better functional and object-oriented implementations
-   [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) support, both cjs and mjs versions are available in distribution

---

## **< 1.1.0**

### Implemented

-   Contexts
-   Middlewares
-   Routes
-   Generators
-   Subscribers

For 1.1.0 and earlier changes, please check commits.
