import type { Knex } from "knex";

const config: Knex.Config = {
  client: "pg",
  connection: () => {
    return process.env.DATABASE_URL
      ? {
          connectionString: process.env.DATABASE_URL,
        }
      : {
          port: process.env.DATABASE_PORT
            ? Number(process.env.DATABASE_PORT)
            : 5432,
          user: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_DB_NAME,
          ssl: {
            rejectUnauthorized: false,
          },
        };
  },
  migrations: {
    tableName: "knex_migrations",
    directory: __dirname + "/migrations/",
  },
};

export default config;
