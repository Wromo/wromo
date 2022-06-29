# @wromojs/cloudflare

An SSR adapter for use with Cloudflare Pages Functions targets. Write your code in Wromo/Node and deploy to Cloudflare Pages.

In your wromo.config.mjs use:

```js
import { defineConfig } from 'wromo/config';
import cloudflare from '@wromojs/cloudflare';

export default defineConfig({
  adapter: cloudflare()
});
```

## Enabling Preview

In order for preview to work you must install `wrangler`

```sh
$ pnpm install wrangler --save-dev
```

It's then possible to update the preview script in your `package.json` to `"preview": "wrangler pages dev ./dist"`

## Streams

Some integrations such as (react)[https://github.com/Wromo/wromo/tree/main/packages/integrations/react] rely on web streams. Currently Cloudflare Pages functions are in beta and don't support the `streams_enable_constructors` feature flag.

In order to work around this:
- install the `"web-streams-polyfill"` package
- add `import "web-streams-polyfill/es2018";` to the top of the front matter of every page which requires streams, such as server rendering a React component.
