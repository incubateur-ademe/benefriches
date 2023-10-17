import fs from "fs";
import { Knex } from "knex";
import path from "path";
import readline from "readline";
import { CarbonStorage } from "./../../../../carbon-storage/domain/models/carbonStorage";

const dataPath = path.resolve(
  __dirname,
  "./../../../../../data/carbonStorage.csv",
);
const HEADER =
  "reservoir,soil_category,stock_tC_by_ha,localisation_category,localisation_code";

const readCsvData = async () => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(dataPath, "utf-8");
    const rl = readline.createInterface({ input: readStream });
    const data: CarbonStorage[] = [];
    rl.on("line", (line) => {
      if (line === HEADER) {
        return;
      }
      const [
        reservoir,
        soil_category,
        stock_tC_by_ha,
        localisation_category,
        localisation_code,
      ] = line.split(",") as [
        CarbonStorage["reservoir"],
        CarbonStorage["soil_category"],
        CarbonStorage["stock_tC_by_ha"],
        CarbonStorage["localisation_category"],
        CarbonStorage["localisation_code"],
      ];
      data.push(
        CarbonStorage.create({
          reservoir,
          soil_category,
          stock_tC_by_ha,
          localisation_category,
          localisation_code,
        }),
      );
    });
    rl.on("error", (error) => {
      reject(error);
    });
    rl.on("close", () => {
      console.log(`Data parsing completed: ${data.length} lines found`);
      resolve(data);
    });
  });
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
exports.seed = async function (knex: Knex): Promise<void> {
  await knex("carbon_storage").del();
  try {
    const data = (await readCsvData()) as CarbonStorage[];

    await knex
      .batchInsert<CarbonStorage & { id: number }>("carbon_storage", data, 1000)
      .returning("id")
      .then(function (ids) {
        console.log(`${ids.length} lines inserted`);
      })
      .catch(function (error) {
        console.warn(`Error while inserting cities`);
        console.error(error);
      });
  } catch (error) {
    console.warn(`Error while reading CSV:`);
    console.error(error);
  }
};
