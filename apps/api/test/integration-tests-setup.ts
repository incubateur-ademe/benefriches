import dotenv from "dotenv";
import knex, { Knex } from "knex";
import { spawn } from "node:child_process";
import path from "node:path";
import { DockerComposeEnvironment, StartedDockerComposeEnvironment } from "testcontainers";

import knexConfig from "../src/shared-kernel/adapters/sql-knex/knexConfig";

const composeFilePath = path.resolve(process.cwd(), "../..");
const composeFile = "docker-compose.db.yml";
const envFilePath = path.resolve(process.cwd(), ".env.test");

let dockerComposeInstance: StartedDockerComposeEnvironment;

const spawnInfrastructure = async () => {
  dockerComposeInstance = await new DockerComposeEnvironment(composeFilePath, composeFile)
    .withEnvironmentFile(envFilePath)
    .up();
};

const stopInfrastructure = async () => {
  await dockerComposeInstance.down();
};

export const setup = async () => {
  // load env vars in process.env
  dotenv.config({ path: envFilePath });

  const sqlConnection: Knex = knex(knexConfig);
  try {
    console.log("Starting infrastructure Docker testcontainer (Postgres, Mailcatcher)...");
    await spawnInfrastructure();
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
    console.error("Error while spawning infrastructure testcontainer");
    await sqlConnection.destroy();
    await stopInfrastructure();
  }
};

export const teardown = async () => {
  try {
    console.log("Stopping infrastructure Docker testcontainer");
    await stopInfrastructure();
  } catch {
    console.log("Failed to stop infrastructure Docker testcontainer");
  }
};
