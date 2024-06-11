### Database install

- `docker compose --env-file apps/api/.env.test -f docker-compose.db.yml up`
- `pnpm knex:migrate-latest`
- `pnpm knex:seed-run`
