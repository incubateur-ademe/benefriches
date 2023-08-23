import path from "path";
import dotenv from "dotenv";
import config from "./knexConfig";

// This file is used by knex migration scripts

// load env vars
const dotEnvPath = path.resolve(process.cwd(), "../../../../.env");
dotenv.config({ path: dotEnvPath });

export default config;
