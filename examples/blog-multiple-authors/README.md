# Wromo Starter Kit: Blog with Multiple Authors

```
npm init wromo -- --template blog-multiple-authors
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Wromo/wromo/tree/latest/examples/blog-multiple-authors)

> 🧑‍🚀 **Seasoned wromonaut?** Delete this file. Have fun!

Features:

- ✅ SEO-friendly setup with canonical URLs and OpenGraph data
- ✅ Full Markdown support
- ✅ RSS 2.0 generation
- ✅ Sitemap.xml generation

## 🚀 Project Structure

Inside of your Wromo project, you'll see the following folders and files:

```
/
├── public/
│   ├── robots.txt
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── Tour.wromo
│   └── pages/
│       └── index.wromo
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
