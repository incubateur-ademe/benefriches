import type { Knex } from "knex";

const config: Record<string, Knex.Config> = {
  test: {
    client: "postgresql",
    connection: {
      port: 5432,
      user: "postgres",
      password: "secret",
      database: "benefriches_db",
    },
    migrations: {
      tableName: "knex_migrations",
      directory: __dirname + "/migrations/",
    },
  },
};

export default config;
