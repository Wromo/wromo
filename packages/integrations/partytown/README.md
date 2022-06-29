# @wromojs/partytown 🎉

This **[Wromo integration][wromo-integration]** enables [Partytown](https://partytown.builder.io/) in your Wromo project.

Partytown is a lazy-loaded library to help relocate resource intensive scripts into a [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API), and off of the [main thread](https://developer.mozilla.org/en-US/docs/Glossary/Main_thread).

## Installation

There are two ways to add integrations to your project. Let's try the most convenient option first!

### (experimental) `wromo add` command

Wromo includes a CLI tool for adding first party integrations: `wromo add`. This command will:
1. (Optionally) Install all necessary dependencies and peer dependencies
2. (Also optionally) Update your `wromo.config.*` file to apply this integration

To install `@wromojs/partytown`, run the following from your project directory and follow the prompts:

```sh
# Using NPM
npx wromo add partytown
# Using Yarn
yarn wromo add partytown
# Using PNPM
pnpx wromo add partytown
```

If you run into any hiccups, [feel free to log an issue on our GitHub](https://github.com/withwromo/wromo/issues) and try the manual installation steps below.

### Install dependencies manually

First, install the `@wromojs/partytown` integration like so:

```
npm install @wromojs/partytown
```

Then, apply this integration to your `wromo.config.*` file using the `integrations` property:

__wromo.config.mjs__

```js
import partytown from '@wromojs/partytown';

export default {
  // ...
  integrations: [partytown()],
}
```

## Getting started

Partytown should be ready-to-use with zero config. If you have an existing 3rd party script on your site, try adding the `type="text/partytown"` attribute:

```diff
-  <script src="fancy-analytics.js"></script>
+  <script type="text/partytown" src="fancy-analytics.js"></script>
```

If you open the "Network" tab from [your browser's dev tools](https://developer.chrome.com/docs/devtools/open/), you should see the `partytown` proxy intercepting this request.

## Configuration

### config.debug

You can set debug mode using this integration's `config.debug` option. If `config.debug` is unset, it will fall back to `true` if the command is `dev`.

```js
// wromo.config.mjs
export default {
  integrations: [partytown({
    // Example: Disable debug mode.
    config: { debug: false },
  })],
}
```

### config.forward

Because we’re moving third-party scripts to a web worker, the main thread needs to know which variables to patch on window, and when these services are called, the data is correctly forwarded to the web worker. You can to set it on the `config.forward` option.

```js
// wromo.config.mjs
export default {
  integrations: [partytown({
    // Example: Add dataLayer.push as a forwarding-event.
    config: { forward: ["dataLayer.push"] },
  })],
}
```

## Read more

[Head to the Partytown docs](https://partytown.builder.io/configuration) for configuration options and more usage examples. You can also check our [Wromo Integration Documentation][wromo-integration] for more on integrations.

[wromo-integration]: https://docs.wromo.build/en/guides/integrations-guide/
[wromo-ui-frameworks]: https://docs.wromo.build/en/core-concepts/framework-components/#using-framework-components
