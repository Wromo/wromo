# @wromojs/svelte 🧡

This **[Wromo integration][wromo-integration]** enables server-side rendering and client-side hydration for your [Svelte](https://svelte.dev/) components.

## Installation

There are two ways to add integrations to your project. Let's try the most convenient option first!

### (experimental) `wromo add` command

Wromo includes a CLI tool for adding first party integrations: `wromo add`. This command will:
1. (Optionally) Install all necessary dependencies and peer dependencies
2. (Also optionally) Update your `wromo.config.*` file to apply this integration

To install `@wromojs/svelte`, run the following from your project directory and follow the prompts:

```sh
# Using NPM
npx wromo add svelte
# Using Yarn
yarn wromo add svelte
# Using PNPM
pnpx wromo add svelte
```

If you run into any hiccups, [feel free to log an issue on our GitHub](https://github.com/Wromo/wromo/issues) and try the manual installation steps below.

### Install dependencies manually

First, install the `@wromojs/svelte` integration like so:

```
npm install @wromojs/svelte
```

Most package managers will install associated peer dependencies as well. Still, if you see a "Cannot find package 'svelte'" (or similar) warning when you start up Wromo, you'll need to install Svelte:

```sh
npm install svelte
```

Now, apply this integration to your `wromo.config.*` file using the `integrations` property:

__wromo.config.mjs__

```js
import svelte from '@wromojs/svelte';

export default {
  // ...
  integrations: [svelte()],
}
```

## Getting started

To use your first Svelte component in Wromo, head to our [UI framework documentation][wromo-ui-frameworks]. You'll explore:
- 📦 how framework components are loaded,
- 💧 client-side hydration options, and
- 🪆 opportunities to mix and nest frameworks together

Also check our [Wromo Integration Documentation][wromo-integration] for more on integrations.

[wromo-integration]: https://docs.wromo.build/en/guides/integrations-guide/
[wromo-ui-frameworks]: https://docs.wromo.build/en/core-concepts/framework-components/#using-framework-components

## Options

This integration is powered by `@sveltejs/vite-plugin-svelte`. To customize the Svelte compiler, options can be provided to the integration. See the `@sveltejs/vite-plugin-svelte` [docs](https://github.com/sveltejs/vite-plugin-svelte/blob/HEAD/docs/config.md) for more details.

### Default options

A few of the default options passed to the Svelte compiler are required to build properly for Wromo and cannot be overridden.

```js
const defaultOptions = {
  emitCss: true,
  compilerOptions: { dev: isDev, hydratable: true },
  preprocess: [
    preprocess({
      less: true,
      sass: { renderSync: true },
      scss: { renderSync: true },
      stylus: true,
      typescript: true,
    }),
  ],
};
```

The `emitCss`, `compilerOptions.dev`, and `compilerOptions.hydratable` cannot be overridden.

Providing your own `preprocess` options **will** override the defaults - make sure to enable the preprocessor flags needed for your project.
