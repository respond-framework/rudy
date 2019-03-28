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

### Debugging

You can use the usual methods to debug errors in the browser. If there are bugs
that prevent the server from serving the page you want to debug, you can debug
the node process. There is a working debug configuration for Visual Studio Code
in `.vscode/launch.json`. You can use a similar configuration to debug using any
node.js debugger.

## Testing Rudy with another app

### Build

To build the exported files for all packages, do `yarn run build` in the root
directory

### yarn link

To connect your app to your local build of rudy, run `yarn link` in
`packages/<package>`, and then `yarn link @respond-framework/<package>` in your
app.

### Make changes

in `packages/<package>`, run `yarn run build --watch` to watch for source
changes and update the built/exported files

Debugging will be easier with source maps. To use them, you should install
[source-map-loader](https://github.com/webpack-contrib/source-map-loader) and
amend your app's webpack config as follows:

```javascript
{
  module: {
    rules: [
      {
        test: /node_modules\/@respond-framework\//,
        enforce: 'pre',
        use: 'source-map-loader',
      },
    ]
  }
  resolve: {
    symlinks: false,
  },
}
```

## Running tests

Rudy has both integration tests and unit tests.

### Integration tests

in `packages/integration-tests` run `yarn run test [--watch]`

### Unit tests

in `packages/<package>`, run `yarn run test [--watch]`
