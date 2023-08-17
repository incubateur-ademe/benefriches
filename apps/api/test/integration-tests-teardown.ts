import { stopPostresDb } from "./integration-tests-setup";

const teardown = async () => {
  console.log("removing DB instance");
  try {
    console.log("Stopping Postgres Docker testcontainer");
    await stopPostresDb();
  } catch (e) {
    console.log("Failed to stop Postgres Docker testcontainer");
  }
};

export default teardown;
