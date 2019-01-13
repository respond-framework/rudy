## React examples

```bash
create-react-app demo
rm demo/src -rf
cp -r basic/{.env,src} demo
cd demo
yarn add redux react-redux @respond-framework/rudy
# git init # needed to apply patches from other examples.
# install any additional libs used by applied patches.
yarn start
```
