import dotenv from "dotenv";
import knex, { Knex } from "knex";
import path from "path";
import { DockerComposeEnvironment, StartedDockerComposeEnvironment } from "testcontainers";

import knexConfig from "../src/shared-kernel/adapters/sql-knex/knexConfig";

const composeFilePath = path.resolve(process.cwd(), "../..");
const composeFile = "docker-compose.db.yml";
const envFilePath = path.resolve(process.cwd(), ".env.test");

let dockerPostgresInstance: StartedDockerComposeEnvironment;

export const spawnPostgresDb = async () => {
  dockerPostgresInstance = await new DockerComposeEnvironment(composeFilePath, composeFile)
    .withEnvironmentFile(envFilePath)
    .up();
};

export const stopPostresDb = async () => {
  await dockerPostgresInstance.down();
};

const setup = async () => {
  // load env vars in process.env
  dotenv.config({ path: envFilePath });

  const sqlConnection: Knex = knex(knexConfig);
  try {
    console.log("Starting Postgres Docker testcontainer");
    await spawnPostgresDb();
    // Run migrations
    await sqlConnection.migrate.latest().then(function () {
      return sqlConnection.seed.run();
    });
  } catch (error) {
    console.error("Error while spawning Postgres testcontainer");
    console.error(error);
    await stopPostresDb();
  } finally {
    await sqlConnection.destroy();
  }
};

export default setup;
