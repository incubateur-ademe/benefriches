import type { Knex } from "knex";
import { types } from "pg";

types.setTypeParser(types.builtins.NUMERIC, (val: string | null) => {
  return val === null ? null : parseFloat(val);
});

const config: Knex.Config = {
  client: "pg",
  connection: () => {
    return {
      // connection string is used in priority, knex will fallback to port/user/password if not provided
      connectionString: process.env.DATABASE_URL ?? undefined,
      port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : 5432,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB_NAME,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    };
  },
  migrations: {
    tableName: "knex_migrations",
    directory: __dirname + "/migrations/",
  },
  seeds: {
    directory: __dirname + "/seeds/",
  },
};

export default config;
