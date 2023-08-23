import type { Knex } from "knex";

const config: Knex.Config = {
  client: "pg",
  connection: () => {
    const connection: Knex.Config["connection"] = {};

    if (process.env.NODE_ENV === "production") {
      connection.ssl = {
        rejectUnauthorized: false,
      };
    }

    return process.env.DATABASE_URL
      ? {
          ...connection,
          connectionString: process.env.DATABASE_URL,
        }
      : {
          ...connection,
          port: process.env.DATABASE_PORT
            ? Number(process.env.DATABASE_PORT)
            : 5432,
          user: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_DB_NAME,
        };
  },
  migrations: {
    tableName: "knex_migrations",
    directory: __dirname + "/migrations/",
  },
};

export default config;
