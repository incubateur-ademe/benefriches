import path from "path";
import knex, { Knex } from "knex";
import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
} from "testcontainers";
import knexConfig from "../src/shared-kernel/adapters/sql-knex/knexfile";

const composeFilePath = path.resolve(process.cwd(), "../..");
const composeFile = "docker-compose.db.yml";

let dockerPostgresInstance: StartedDockerComposeEnvironment;

export const spawnPostgresDb = async () => {
  dockerPostgresInstance = await new DockerComposeEnvironment(
    composeFilePath,
    composeFile,
  ).up();
};

export const stopPostresDb = async () => {
  await dockerPostgresInstance.down();
};

const setup = async () => {
  const sqlConnection: Knex = knex(knexConfig.test);
  try {
    console.log("Starting Postgres Docker testcontainer");
    await spawnPostgresDb();
    // Run migrations
    await sqlConnection.migrate.latest();
  } catch (error) {
    await stopPostresDb();
  } finally {
    await sqlConnection.destroy();
  }
};

export default setup;
