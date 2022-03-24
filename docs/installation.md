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

[**Documentation**](README.md) > **Installation**

---

## Distributions

Contexted is released in three different versions: [CJS](https://nodejs.org/docs/latest/api/modules.html#modules-commonjs-modules) (ES3), [MJS](https://nodejs.org/docs/latest/api/modules.html#the-mjs-extension) (ES6), and [IIFE](https://developer.mozilla.org/en-US/docs/Glossary) (ES3).

You can use CJS and MJS versions with [NodeJS](#nodejs) or with code bundlers and IIFE version with [Browsers](#browsers).

Contexted is written in [TypeScript](https://www.typescriptlang.org/), so it ships with a declaration file as well.

## NodeJS

### Prerequisites

To use Contexted in [NodeJS](https://nodejs.org/) applications or with code bundlers, you have to install the latest version of **NodeJS** first. You can download the latest version from the following link:

[NodeJS Downloads](https://nodejs.org/en/download/)

To confirm that you have **NodeJS** and **NPM** installed on your machine, run the following commands inside a command line:

```sh
node -v
npm -v
```

### Installation

`@contexted/core` package is accessible via NPM:

```sh
npm i --save @contexted/core
```

### Usage

CommonJS:

```js
const { Contexted, createContextedInstance } = require('@contexted/core');
```

MJS:

```js
import { Contexted, createContextedInstance } from '@contexted/core';
```

## Browsers

### Installation

`@contexted/core` package is available on [unpkg CDN](unpkg.com/@contexted/core) for in-browser implementations:

```html
<script src="unpkg.com/@contexted/core"></script>
```

### Usage

After loading the script, exported objects will append to the [Window](https://developer.mozilla.org/en-US/docs/Web/API/Window) object:

```html
<script>
	!!Contexted; // is true
	!!createContextedInstance; // is true
</script>
```

---

< Prev Page
[Documentations](README.md)

Next Page >
[Concepts](concepts/README.md)
