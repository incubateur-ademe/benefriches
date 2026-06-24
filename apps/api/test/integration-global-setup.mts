import dotenv from "dotenv";
import { spawn } from "node:child_process";
import path from "node:path";
import { DockerComposeEnvironment, StartedDockerComposeEnvironment, Wait } from "testcontainers";

const composeFilePath = path.resolve(process.cwd(), "../..");
const composeFile = "docker-compose.db.yml";
const envFilePath = path.resolve(process.cwd(), ".env.test");

let dockerComposeInstance: StartedDockerComposeEnvironment;

const spawnInfrastructure = async () => {
  dockerComposeInstance = await new DockerComposeEnvironment(composeFilePath, composeFile)
    .withEnvironmentFile(envFilePath)
    .withDefaultWaitStrategy(Wait.forListeningPorts())
    .up();
};

const runPnpm = (script: string) =>
  new Promise<void>((resolve, reject) => {
    const p = spawn("pnpm", [script]);
    p.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`pnpm ${script} exited with code ${String(code)}`));
      } else {
        resolve();
      }
    });
    p.on("error", reject);
  });

export const globalSetup = async () => {
  dotenv.config({ path: envFilePath });
  console.log("Starting infrastructure Docker testcontainer (Postgres, Mailcatcher)...");
  await spawnInfrastructure();
  console.log("Running migrations...");
  await runPnpm("knex:migrate-latest");
  console.log("Migrations successfully applied ✅");
  console.log("Running seeds...");
  await runPnpm("knex:seed-run");
  console.log("Seeds successfully imported ✅");
};

export const globalTeardown = async () => {
  try {
    console.log("Stopping infrastructure Docker testcontainer");
    await dockerComposeInstance.down();
  } catch {
    console.log("Failed to stop infrastructure Docker testcontainer");
  }
};
