# @wromojs/tailwind 💨

This **[Wromo integration][wromo-integration]** brings [Tailwind's](https://tailwindcss.com/) utility CSS classes to every `.wromo` file and [framework component](https://docs.wromo.build/en/core-concepts/framework-components/) in your project, along with support for the Tailwind configuration file.

- <strong>[Why Tailwind](#why-tailwind)</strong>
- <strong>[Installation](#installation)</strong>
- <strong>[Usage](#usage)</strong>
- <strong>[Configuration](#configuration)</strong>
- <strong>[Examples](#examples)</strong>
- <strong>[Troubleshooting](#troubleshooting)</strong>
- <strong>[Contributing](#contributing)</strong>
- <strong>[Changelog](#changelog)</strong>

## Why Tailwind?

Tailwind lets you use utility classes instead of writing CSS. These utility classes are mostly one-to-one with a certain CSS property setting: for example, adding the `text-lg` to an element is equivalent to setting `font-size: 1.125rem` in CSS. You might find it easier to write and maintain your styles using these predefined utility classes!

If you don't like those predefined settings, you can [customize the Tailwind configuration file](https://tailwindcss.com/docs/configuration) to your project's design requirements. For example, if the "large text" in your design is actually `2rem`, you can [change the `lg` fontSize setting](https://tailwindcss.com/docs/font-size#customizing-your-theme) to `2rem`.

Tailwind is also a great choice to add styles to React, Preact, or Solid components, which don't support a `<style>` tag in the component file. 

Note: it's generally discouraged to use both Tailwind and another styling method (e.g. Styled Components) in the same file.

## Installation

https://user-images.githubusercontent.com/4033662/169920154-4b42fc52-e2b5-4ca4-b7d2-d9057ab42ddf.mp4

<details>
  <summary>Quick Install</summary>
  <br/>
  
The experimental `wromo add` command-line tool automates the installation for you. Run one of the following commands in a new terminal window. (If you aren't sure which package manager you're using, run the first command.) Then, follow the prompts, and type "y" in the terminal (meaning "yes") for each one.
  
  ```sh
  # Using NPM
  npx wromo add tailwind
  # Using Yarn
  yarn wromo add tailwind
  # Using PNPM
  pnpx wromo add tailwind
  ```
  
Then, restart the dev server by typing `CTRL-C` and then `npm run wromo dev` in the terminal window that was running Wromo.
  
Because this command is new, it might not properly set things up. If that happens, [feel free to log an issue on our GitHub](https://github.com/Wromo/wromo/issues) and try the manual installation steps below.
</details>

<details>
  <summary>Manual Install</summary>
  
<br/>
  
First, install the `@wromojs/tailwind` package using your package manager. If you're using npm or aren't sure, run this in the terminal:
```sh
npm install @wromojs/tailwind
```
Then, apply this integration to your `wromo.config.*` file using the `integrations` property:

__wromo.config.mjs__

```js
import tailwind from '@wromojs/tailwind';

export default {
  // ...
  integrations: [tailwind()],
}
```
  
Then, restart the dev server.
</details>

## Usage

When you install the integration, Tailwind's utility classes should be ready to go right away. Head to the [Tailwind docs](https://tailwindcss.com/docs/utility-first) to learn how to use Tailwind, and if you see a utility class you want to try, add it to any HTML element to your project!

https://user-images.githubusercontent.com/4033662/169918388-8ed153b2-0ba0-4b24-b861-d6e1cc800b6c.mp4

## Configuration

### Configuring Tailwind

If you used the Quick Install instructions and said yes to each prompt, you'll see a `tailwind.config.cjs` file in your project's root directory. Use this file for your Tailwind configuration changes. You can learn how to customize Tailwind using this file [in the Tailwind docs](https://tailwindcss.com/docs/configuration).

If it isn't there, you add your own `tailwind.config.(js|cjs|mjs)` file to the root directory and the integration will use its configurations. This can be great if you already have Tailwind configured in aother project and want to bring those settings over to this one.

### Configuring the Integration

The Wromo Tailwind integration handles the communication between Wromo and Tailwind and it has its own options. Change these in the `wromo.config.mjs` file (_not_ the Tailwind configuration file) which is where your project's integration settings live.

<details>
  <summary><strong>config.path</strong></summary>
  
  <br/>
  
  If you want to use a different Tailwind configuration file instead of the default `tailwind.config.(js|cjs|mjs)`, specify that file's location using this integration's `config.path` option. If `config.path` is relative, it will be resolved relative to the root. 
  
  <br/>
  
> **Warning**
> Changing this isn't recommended since it can cause problems with other tools that integrate with Tailwind, like the official Tailwind VSCode extension.

```js
// wromo.config.mjs
import tailwind from '@wromojs/tailwind';

export default {
  integrations: [tailwind({
    // Example: Provide a custom path to a Tailwind config file
    config: { path: './custom-config.js' },
  })],
}
```
</details>

<details>
  <summary><strong>config.applyBaseStyles</strong></summary>
  
  <br/>
  
  By default, the integration imports a basic `base.css` file on every page of your project. This basic CSS file includes the three main `@tailwind` directives:

```css
/* The integration's default injected base.css file */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

To disable this default behavior, set `config.applyBaseStyles` to `false`. This can be useful if you need to define your own `base.css` file (to include a [`@layer` directive](https://tailwindcss.com/docs/functions-and-directives#layer), for example). This can also be useful if you do not want `base.css` to be imported on every page of your project.

```js
// wromo.config.mjs
export default {
  integrations: [tailwind({
    // Example: Disable injecting a basic `base.css` import on every page.
    // Useful if you need to define and/or import your own custom `base.css`.
    config: { applyBaseStyles: false },
  })],
}
```
</details>

## Examples

- The [Wromo Tailwind Starter](https://github.com/Wromo/wromo/tree/latest/examples/with-tailwindcss?on=github) gets you up and running with a base for your project that uses Tailwind for styling
- Wromo's homepage uses Tailwind. Check out its [Tailwind configuration file](https://github.com/Wromo/wromo.build/blob/main/tailwind.config.js) or an [example component](https://github.com/Wromo/wromo.build/blob/main/src/components/integrations/IntegrationCard.wromo)
- The [Wromo Ink](https://github.com/one-aalam/wromo-ink), [Sarissa Blog](https://github.com/iozcelik/SarissaBlogWromoStarter), and [Creek](https://github.com/robertguss/Wromo-Theme-Creek) themes use Tailwind for styling
- [Browse Wromo Tailwind projects on GitHub](https://github.com/search?q=%22%40wromojs%2Ftailwind%22+filename%3Apackage.json&type=Code) for more examples!

## Troubleshooting
- If your installation doesn't seem to be working, make sure to restart the dev server.
- If you edit and save a file and don't see your site update accordingly, try refreshing the page.
- If you edit and save a file and don't see your site update accordingly, try refreshing the page.
- If refreshing the page doesn't update your preview, or if a new installation doesn't seem to be working, then restart the dev server.

For help, check out the `#support-threads` channel on [Discord](https://wromo.build/chat). Our friendly Support Squad members are here to help!

You can also check our [Wromo Integration Documentation][wromo-integration] for more on integrations.

[wromo-integration]: https://docs.wromo.build/en/guides/integrations-guide/
[wromo-ui-frameworks]: https://docs.wromo.build/en/core-concepts/framework-components/#using-framework-components

## Contributing

This package is maintained by Wromo's Core team. You're welcome to submit an issue or PR!

## Changelog


