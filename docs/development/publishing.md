# Publishing new versions

1. Set up a personal access token in github with push access to the repository.
   Add the token to the environment with `$ export GH_TOKEN=<token>`. This is to
   annotate the tags with github releases.
1. Authenticate with the NPM CLI (verify with `$ npm whoami`)
1. Temporarily disable branch protection on the repository (the lerna release
   script needs to push to master)
1. Do the release with lerna:
   `$ yarn run lerna publish [prerelease] [--preid <preid>]`. This is the point
   of no return, if it succeeds in creating the releases on NPM.
1. Turn branch protection back on

There will be a prompt to confirm the new versions of packages to be published.
Changelogs will automatically be generated and new version numbers chosen based
on the [commit history](./commit-messages.md). See the
[lerna docs](https://github.com/lerna/lerna/tree/master/commands/publish#readme)
for more details such as how to use pre releases, dist tags, etc.
