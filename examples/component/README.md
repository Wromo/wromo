# Wromo Starter Kit: Component

```
npm init wromo -- --template component
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Wromo/wromo/tree/latest/examples/component)

> 🧑‍🚀 **Seasoned wromonaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Wromo project, you'll see the following folders and files:

```
/
├── demo/
│   ├── public/
│   └── src/
│       └── pages/
│           └── index.wromo
└── packages/
    └── my-component/
        ├── index.js
        └── package.json
```

This project uses **workspaces** to develop a single package, `@example/my-component`, from `packages/my-component`. It also includes a `demo` Wromo site for testing and demonstrating the component.



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
