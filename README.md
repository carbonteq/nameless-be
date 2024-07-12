# Batflow Backend

## Required Infra

- Postgres
- `pnpm` as the package manager (`corepack enable pnpm`)

## Init steps

- `cp .env.example .env`
- Fill `.env` with appropriate values
- `pnpm install --frozen-lockfile` to install dependencies with exact locked versions
- Run db migrations with `pnpm db:mig`
- Seed the db with `pnpm db:seed`
- To run drizzle studio (for checking db records), use `pnpm db:std`
- `pnpm start -b swc` to start the server

After every code update, make sure to:

- Update the installed dependencies `pnpm install --frozen-lockfile`
- Add/Update the values in `.env` file if required
- Run any pending db migrations `pnpm db:mig`
