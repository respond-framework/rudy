# Hacking

## Setup/installation

Check out a copy of this repository and then install its dependencies:

```shell
yarn
```

## Running the example/boilerplate

The boilerplate package provides an example of the use of rudy. You can run a
development server as follows:

```shell
cd packages/boilerplate
yarn run start
```

The boilerplate should be accessible at `http://localhost:3000`.

You can edit any of the source code (anywhere in the repository) and the
server/browser will update accordingly, including HMR and with source maps.

## Debugging

You can use the usual methods to debug errors in the browser. If there are bugs
that prevent the server from serving the page you want to debug, you can debug
the node process. There is a working debug configuration for Visual Studio Code
in `.vscode/launch.json`. You can use a similar configuration to debug using any
node.js debugger.
