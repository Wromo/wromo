## 🚀 Project Structure

Inside of your Wromo project, you'll see the following folders and files:

```
├── public/
│   ├── logo.svg
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── Logo.wromo
│   ├── content/
│   │   └── Tour.md
│   └── pages/
│       └── index.wromo
└── package.json
```

Wromo looks for `.wromo` or `.md` files in the `src/pages/` directory.
Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Wromo/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 👀 Want to learn more?

Check out the [Wromo Documentation](https://github.com/Wromo/wromo) site or jump into our [Discord server](https://wromo.build/chat).
