# Contributing

## Questions

If you have questions about implementation details, help, or support, please use the community forum at [Github Discussions](https://github.com/DamianOsipiuk/vue-query/discussions).

## Reporting Issues

If you have found what you think is a bug, please [file an issue](https://github.com/DamianOsipiuk/vue-query/issues/new).

## Suggesting new features

If you want to suggest a feature, [create an issue](https://github.com/DamianOsipiuk/vue-query/issues/new) if it does not already exist. From there, we will discuss use-cases and implementation details.

## Development

While contributing, make sure to follow the guidelines:

- run `npm run verify` before opening a PR
- write tests for any new piece of code that you are adding to the repository when applicable

## Commit message conventions

`vue-query` is following [Angular Commit Message Conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).

## Pull requests

Maintainers should merge pull requests by squashing all commits and editing the commit message if necessary, using the GitHub user interface.

Use an appropriate commit type. Be especially careful with breaking changes.

## Releases

For each new commit added to the `master` branch (push or merge), a GitHub action gets triggered that runs the [semantic-release](https://github.com/semantic-release/semantic-release)
