import { spawn } from "child_process";
import dotenv from "dotenv";
import knex, { Knex } from "knex";
import path from "path";
import { DockerComposeEnvironment, StartedDockerComposeEnvironment } from "testcontainers";

import knexConfig from "../src/shared-kernel/adapters/sql-knex/knexConfig";

const composeFilePath = path.resolve(process.cwd(), "../..");
const composeFile = "docker-compose.db.yml";
const envFilePath = path.resolve(process.cwd(), ".env.test");

let dockerPostgresInstance: StartedDockerComposeEnvironment;

const spawnPostgresDb = async () => {
  dockerPostgresInstance = await new DockerComposeEnvironment(composeFilePath, composeFile)
    .withEnvironmentFile(envFilePath)
    .up();
};

const stopPostresDb = async () => {
  await dockerPostgresInstance.down();
};

export const setup = async () => {
  // load env vars in process.env
  dotenv.config({ path: envFilePath });

  const sqlConnection: Knex = knex(knexConfig);
  try {
    console.log("Starting Postgres Docker testcontainer");
    await spawnPostgresDb();
    console.log("Running migrations...");
    await new Promise((resolve, reject) => {
      // we spawn a process to run migrations instead of using knex's migrate API because it does not work well with TS/ESM migration files
      // see https://github.com/knex/knex/issues/5323
      const p = spawn("pnpm", ["knex:migrate-latest"]);
      p.on("close", resolve);
      p.on("error", reject);
    });
    console.log("Migrations successfully applied ✅");
    console.log("Running seeds...");
    await new Promise((resolve, reject) => {
      const p = spawn("pnpm", ["knex:seed-run"]);
      p.on("close", resolve);
      p.on("error", reject);
    });
    console.log("Seeds successfully imported ✅");
    await sqlConnection.destroy();
  } catch (error) {
    console.error(error);
    console.error("Error while spawning Postgres testcontainer");
    await sqlConnection.destroy();
    await stopPostresDb();
  }
};

export const teardown = async () => {
  console.log("removing DB instance");
  try {
    console.log("Stopping Postgres Docker testcontainer");
    await stopPostresDb();
  } catch {
    console.log("Failed to stop Postgres Docker testcontainer");
  }
};
