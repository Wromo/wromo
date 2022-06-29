# Wromo Starter Kit: Non-HTML Pages

Documentation for "Non-HTML Pages":

https://docs.wromo.build/en/core-concepts/wromo-pages/#non-html-pages

```
npm init wromo -- --template non-html-pages
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withwromo/wromo/tree/latest/examples/non-html-pages)

> 🧑‍🚀 **Seasoned wromonaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Wromo project, you'll see the following folders and files:

```
/
├── public/
├── src/
│   └── pages/
│       └── index.wromo
│       └── about.json.ts
└── package.json
```

Wromo looks for `.wromo` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Wromo/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                       |
|:----------------  |:-------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:3000`  |
| `npm run build`   | Build your production site to `./dist/`      |
| `npm run preview` | Preview your build locally, before deploying |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.wromo.build) or jump into our [Discord server](https://wromo.build/chat).
