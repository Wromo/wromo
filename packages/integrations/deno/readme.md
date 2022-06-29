# @wromojs/deno

A server-side rendering adapter for use with Deno targets. Write your code in Wromo/Node and deploy to Deno servers.

In your wromo.config.mjs use:

```js
import { defineConfig } from 'wromo/config';
import deno from '@wromojs/deno';

export default defineConfig({
  adapter: deno()
});
```

After performing a build there will be a `dist/server/entry.mjs` module. You can start a server simply by importing this module:

```js
import './dist/entry.mjs';
```

## API

### Adapter options

This adapter automatically starts a server when it is imported. You can configure this through options:

```js
import { defineConfig } from 'wromo/config';
import deno from '@wromojs/deno';

export default defineConfig({
  adapter: deno({
    start: false
  })
});
```

If disabling start you need to write your own web server and use `handle` to render requests:

```ts
import { serve } from "https://deno.land/std@0.132.0/http/server.ts";
import { handle } from './dist/entry.mjs';

serve((req: Request) => {
  // Check the request, maybe do static file handling here.

  return handle(req);
});
```

----

You an also pass in a port/hostname to use:

```js
import { defineConfig } from 'wromo/config';
import deno from '@wromojs/deno';

export default defineConfig({
  adapter: deno({
    port: 8081,
    hostname: 'myhost'
  })
});
```
