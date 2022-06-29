# vite-plugin-config-alias

This adds aliasing support to Vite from `tsconfig.json` or `jsconfig.json` files.

Consider the following example configuration:

```
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "components:*": ["components/*.wromo"]
    }
  }
}
```

With this configuration, the following imports would map to the same location.

```js
import Test from '../components/Test.wromo'

import Test from 'components/Test.wromo'

import Test from 'components:Test'
```
