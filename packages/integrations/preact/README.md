# @wromojs/preact ⚛️

This **[Wromo integration][wromo-integration]** enables server-side rendering and client-side hydration for your [Preact](https://preactjs.com/) components.

## Installation

There are two ways to add integrations to your project. Let's try the most convenient option first!

### (experimental) `wromo add` command

Wromo includes a CLI tool for adding first party integrations: `wromo add`. This command will:
1. (Optionally) Install all necessary dependencies and peer dependencies
2. (Also optionally) Update your `wromo.config.*` file to apply this integration

To install `@wromojs/preact`, run the following from your project directory and follow the prompts:

```sh
# Using NPM
npx wromo add preact
# Using Yarn
yarn wromo add preact
# Using PNPM
pnpx wromo add preact
```

If you run into any hiccups, [feel free to log an issue on our GitHub](https://github.com/withwromo/wromo/issues) and try the manual installation steps below.

### Install dependencies manually

First, install the `@wromojs/preact` integration like so:

```
npm install @wromojs/preact
```

Most package managers will install associated peer dependencies as well. Still, if you see a "Cannot find package 'preact'" (or similar) warning when you start up Wromo, you'll need to install Preact:

```sh
npm install preact
```

Now, apply this integration to your `wromo.config.*` file using the `integrations` property:

__wromo.config.mjs__

```js
import preact from '@wromojs/preact';

export default {
  // ...
  integrations: [preact()],
}
```

## Getting started

To use your first Preact component in Wromo, head to our [UI framework documentation][wromo-ui-frameworks]. You'll explore:
- 📦 how framework components are loaded,
- 💧 client-side hydration options, and
- 🪆 opportunities to mix and nest frameworks together

Also check our [Wromo Integration Documentation][wromo-integration] for more on integrations.

[wromo-integration]: https://docs.wromo.build/en/guides/integrations-guide/
[wromo-ui-frameworks]: https://docs.wromo.build/en/core-concepts/framework-components/#using-framework-components
