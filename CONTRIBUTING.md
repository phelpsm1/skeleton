# Contributing to skeleton

## Commit Message Guidelines

### Commit Message Format

A commit message consists of a mandatory __header__ and may include an optional __body__ and/or __footer__.

        <type>: <subject>
        <BLANK LINE>
        <optional body>
        <BLANK LINE>
        <optional footer>

### Type

Must be one of the following:

* __build__: Changes that affect the build system or external dependencies.
* __chore__: Changes made for maintenance reasons e.g. increasing package.json version.
* __ci__: Changes to our CI configuration files and scripts.
* __docs__: Documentation only changes.
* __feat__: A new feature.
* __fix__: A bug fix.
* __perf__: A code change that improves performance.
* __refactor__: A code change that neither fixes a bug nor adds a feature.
* __revert__: The commit reverts a previous commit.
* __style__: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
* __test__: Adding missing tests or correcting existing tests.

### Revert

The commit message for a revert has the following format:

        revert: <header of commit being reverted>
        <BLANK LINE>
        This reverts commit <hash of commit being reverted>.

### Subject

The __subject__ contains a short description of the change and has the following rules:

* Uses the imperative, present tense e.g. “change” not “changed” nor “changes”.
* Don't capitalize the first letter.
* No period (.) at the end.

### Body

Like the __subject__, uses the imperative and provides additional context of the change.

### Footer

The __footer__ format is TBD but would be used for communicating breaking changes and referencing closed issues or stories.

## Release Workflow

1. make a release branch ``git checkout -b release-v0.2.0 develop``
2. bump version in package.json
3. commit package.json

   ``git commit -a -m 'chore: bumped version number'``

4. generate changelog with [conventionalChangelog](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli)

   ``npm run changelog``

5. commit CHANGELOG.md

   ``git commit -a -m 'chore: update changelog'``

6. finish the release branch
    1. ``git checkout master``
    2. ``git merge --no-ff release-v0.2.0``
    3. ``git tag -a v0.2.0 -m 'release v0.2.0'``
    4. ``git checkout develop``
    5. ``git merge --no-ff release-v0.2.0``
    6. ``git branch -d release-v0.2.0``

7. push

    1. ``git push --all --follow-tags``
