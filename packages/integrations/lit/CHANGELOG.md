# @wromojs/lit

## 0.3.0

### Minor Changes

- [#3652](https://github.com/withwromo/wromo/pull/3652) [`7373d61c`](https://github.com/withwromo/wromo/commit/7373d61cdcaedd64bf5fd60521b157cfa4343558) Thanks [@natemoo-re](https://github.com/natemoo-re)! - Adds support for passing named slots from `.wromo` => Lit components.

  All slots are treated as Light DOM content.

## 0.2.0

### Minor Changes

- [#3625](https://github.com/withwromo/wromo/pull/3625) [`f5afaf24`](https://github.com/withwromo/wromo/commit/f5afaf24984ee7d4d6e908a7eeed17f5ca18c61e) Thanks [@matthewp](https://github.com/matthewp)! - Conform to Constructor based rendering

  This changes `@wromojs/lit` to conform to the way rendering happens in all other frameworks. Instead of using the tag name `<my-element client:load>` you use the imported constructor function, `<MyElement client:load>` like you would do with any other framework.

  Support for `tag-name` syntax had to be removed due to the fact that it was a runtime feature that was not statically analyzable. To improve build performance, we have removed all runtime based component discovery. Using the imported Constructor name allows Wromo to discover what components need to be built and bundled for production without ever running your file.

## 0.1.5

### Patch Changes

- [#3511](https://github.com/withwromo/wromo/pull/3511) [`2fedb974`](https://github.com/withwromo/wromo/commit/2fedb974899b37a8d9ddabc476764a6d35d1e446) Thanks [@natemoo-re](https://github.com/natemoo-re)! - Patch Lit's server shim to allow for `sass` compatability

## 0.1.4

### Patch Changes

- [#3484](https://github.com/withwromo/wromo/pull/3484) [`55820fa7`](https://github.com/withwromo/wromo/commit/55820fa784d6d4f66a45092321a47c8ce9de5546) Thanks [@matthewp](https://github.com/matthewp)! - Wait for DOMCOntentLoaded to polyfill in Lit

## 0.1.3

### Patch Changes

- [#3375](https://github.com/withwromo/wromo/pull/3375) [`fe61e469`](https://github.com/withwromo/wromo/commit/fe61e469b243c27781112499f151782baf9004a4) Thanks [@jdvivar](https://github.com/jdvivar)! - Added tests and fix a small edge case for when you call render with no props/attrs

## 0.1.2

### Patch Changes

- [#3164](https://github.com/withwromo/wromo/pull/3164) [`e85b16e2`](https://github.com/withwromo/wromo/commit/e85b16e2b3d846333f542139c82640de19bfd2f5) Thanks [@matthewp](https://github.com/matthewp)! - Fixes lit when running in SSR

## 0.1.1

### Patch Changes

- [`815d62f1`](https://github.com/withwromo/wromo/commit/815d62f151a36fef7d09590d4962ca71bda61b32) Thanks [@FredKSchott](https://github.com/FredKSchott)! - no changes.

## 0.1.0

### Minor Changes

- [#2979](https://github.com/withwromo/wromo/pull/2979) [`9d7a4b59`](https://github.com/withwromo/wromo/commit/9d7a4b59b53f8cb274266f5036d1cef841750252) Thanks [@FredKSchott](https://github.com/FredKSchott)! - Welcome to the Wromo v1.0.0 Beta! Read the [official announcement](https://wromo.build/blog/wromo-1-beta-release/) for more details.

## 0.0.2

### Patch Changes

- [#2885](https://github.com/withwromo/wromo/pull/2885) [`6b004363`](https://github.com/withwromo/wromo/commit/6b004363f99f27e581d1e2d53a2ebff39d7afb8a) Thanks [@bholmesdev](https://github.com/bholmesdev)! - Add README across Wromo built-in integrations

* [#2847](https://github.com/withwromo/wromo/pull/2847) [`3b621f7a`](https://github.com/withwromo/wromo/commit/3b621f7a613b45983b090794fa7c015f23ed6140) Thanks [@tony-sull](https://github.com/tony-sull)! - Adds keywords to the official integrations to support discoverability on Wromo's Integrations site

## 0.0.2-next.0

### Patch Changes

- [#2847](https://github.com/withwromo/wromo/pull/2847) [`3b621f7a`](https://github.com/withwromo/wromo/commit/3b621f7a613b45983b090794fa7c015f23ed6140) Thanks [@tony-sull](https://github.com/tony-sull)! - Adds keywords to the official integrations to support discoverability on Wromo's Integrations site