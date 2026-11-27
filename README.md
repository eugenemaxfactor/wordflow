# wordflow

English vocabulary learning app built with TypeScript

## Live Demo

[Open WordFlow on GitHub Pages](https://eugenemaxfactor.github.io/wordflow/)

## Production Deployment

WordFlow is deployed to GitHub Pages from the `main` branch. The deployment
workflow installs dependencies with `npm ci`, runs the project quality checks,
creates the production build with `npm run build`, and publishes the generated
`dist` directory.

The Vite base path is set to `/wordflow/` in `vite.config.ts` because the site
is published as a GitHub Pages repository site. No deployment secrets or local
environment files are required.

Deployment runs automatically after a push to `main`. It can also be started
manually from the **Actions → Deploy to GitHub Pages** page with the
`workflow_dispatch` action.

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
