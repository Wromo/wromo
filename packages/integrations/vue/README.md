# @wromojs/vue 💚

This **[Wromo integration][wromo-integration]** enables server-side rendering and client-side hydration for your [Vue 3](https://vuejs.org/) components.

## Installation

There are two ways to add integrations to your project. Let's try the most convenient option first!

### (experimental) `wromo add` command

Wromo includes a CLI tool for adding first party integrations: `wromo add`. This command will:
1. (Optionally) Install all necessary dependencies and peer dependencies
2. (Also optionally) Update your `wromo.config.*` file to apply this integration

To install `@wromojs/vue`, run the following from your project directory and follow the prompts:

```sh
# Using NPM
npx wromo add vue
# Using Yarn
yarn wromo add vue
# Using PNPM
pnpx wromo add vue
```

If you run into any hiccups, [feel free to log an issue on our GitHub](https://github.com/Wromo/wromo/issues) and try the manual installation steps below.

### Install dependencies manually

First, install the `@wromojs/vue` integration like so:

```
npm install @wromojs/vue
```

Most package managers will install associated peer dependencies as well. Still, if you see a "Cannot find package 'vue'" (or similar) warning when you start up Wromo, you'll need to install Vue:

```sh
npm install vue
```

Now, apply this integration to your `wromo.config.*` file using the `integrations` property:

__wromo.config.mjs__

```js
import vue from '@wromojs/vue';

export default {
  // ...
  integrations: [vue()],
}
```

## Getting started

To use your first Vue component in Wromo, head to our [UI framework documentation][wromo-ui-frameworks]. You'll explore:
- 📦 how framework components are loaded,
- 💧 client-side hydration options, and
- 🪆 opportunities to mix and nest frameworks together

Also check our [Wromo Integration Documentation][wromo-integration] for more on integrations.

[wromo-integration]: https://docs.wromo.build/en/guides/integrations-guide/
[wromo-ui-frameworks]: https://docs.wromo.build/en/core-concepts/framework-components/#using-framework-components

## Options

This integration is powered by `@vitejs/plugin-vue`. To customize the Vue compiler, options can be provided to the integration. See the `@vitejs/plugin-vue` [docs](https://github.com/vitejs/vite/tree/main/packages/plugin-vue) for more details.

__wromo.config.mjs__

```js
import vue from '@wromojs/vue';

export default {
  // ...
  integrations: [vue({
    template: {
      compilerOptions: {
        // treat any tag that starts with ion- as custom elements
        isCustomElement: tag => tag.startsWith('ion-')
      }
    }
    // ...
  })],
}
```
