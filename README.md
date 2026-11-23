# wordflow

English vocabulary learning app built with TypeScript

## Development / Code Quality

Install dependencies with `npm ci` before running the checks locally.

- Run `npm run lint` to check JavaScript and TypeScript files with ESLint.
- Run `npm run lint:fix` to apply ESLint fixes where possible.
- Run `npm run format:check` to verify formatting with Prettier.
- Run `npm run format` to format supported project files with Prettier.

Husky installs the Git hooks through the `prepare` npm script. Before each
commit, lint-staged runs ESLint and Prettier only on staged files and adds any
supported automatic fixes back to the commit.

GitHub Actions runs ESLint, checks Prettier formatting, runs the Vitest test
suite, and creates a production build for every pull request and every push to
`main`.
