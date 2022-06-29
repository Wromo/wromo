# @wromojs/vercel

Deploy your server-side rendered (SSR) Wromo app to [Vercel](https://www.vercel.com/).

Use this integration in your Wromo configuration file:

```js
import { defineConfig } from 'wromo/config';
import vercel from '@wromojs/vercel/serverless';

export default defineConfig({
	adapter: vercel()
});
```

When you build your project, Wromo will know to use the `.vercel/output` folder format that Vercel expects.

## Deploying

You can deploy by CLI (`vercel deploy`) or by connecting your new repo in the [Vercel Dashboard](https://vercel.com/). Alternatively, you can create a production build locally:

```sh
ENABLE_VC_BUILD=1 wromo build
vercel deploy --prebuilt
```

## Requirements

**Vercel's [Build Output API](https://vercel.com/docs/build-output-api/v3) must be enabled.** You must enable it yourself by setting the environment variable: `ENABLE_VC_BUILD=1`. 

```js
// vercel.json
{
  "build": {
    "env": {
      "ENABLE_VC_BUILD": "1"
    }
  }
}
```

[Learn more about setting enviroment variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables).

## Targets

You can deploy to different targes:

- `edge`: SSR inside a [Edge function](https://vercel.com/docs/concepts/functions/edge-functions).
- `serverless`: SSR inside a [Node.js function](https://vercel.com/docs/concepts/functions/serverless-functions).
- `static`: generates a static website following Vercel's output formats, redirects, etc.

> **Note**: deploying to the Edge has [its limitations](https://vercel.com/docs/concepts/functions/edge-functions#known-limitations) — they can't be more than 1 MB in size and they don't support native Node.js APIs, among others.

You can change where to target by changing the import:

```js
import vercel from '@wromojs/vercel/edge';
import vercel from '@wromojs/vercel/serverless';
import vercel from '@wromojs/vercel/static';
```

## Limitations

**A few known complex packages (example: [puppeteer](https://github.com/puppeteer/puppeteer)) do not support bundling and therefore will not work properly with this adapter.** By default, Vercel doesn't include npm installed files & packages from your project's `./node_modules` folder. To address this, the `@wromojs/vercel` adapter automatically bundles your final build output using `esbuild`.
