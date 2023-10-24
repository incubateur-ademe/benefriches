### Database install

- `docker-compose -f docker-compose.db.yml up`
- `pnpm knex:migrate-latest`
- `pnpm knex:seed-run`
