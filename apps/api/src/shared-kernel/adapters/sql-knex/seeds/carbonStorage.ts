import fs from "fs";
import { Knex } from "knex";
import path from "path";
import readline from "readline";
import {
  CarbonStorage,
  CarbonStorageProps,
} from "./../../../../carbon-storage/core/models/carbonStorage";

const dataPath = path.resolve(__dirname, "./../../../../../data/carbonStorage.csv");
const HEADER = "reservoir,soil_category,stock_tC_by_ha,localisation_category,localisation_code";

const readCsvData = async () => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(dataPath, "utf-8");
    const rl = readline.createInterface({ input: readStream });
    const data: CarbonStorageProps[] = [];
    rl.on("line", (line) => {
      if (line === HEADER) {
        return;
      }
      const [reservoir, soil_category, stock_tC_by_ha, localisation_category, localisation_code] =
        line.split(",") as [
          CarbonStorageProps["reservoir"],
          CarbonStorageProps["soil_category"],
          CarbonStorageProps["stock_tC_by_ha"],
          CarbonStorageProps["localisation_category"],
          CarbonStorageProps["localisation_code"],
        ];
      data.push(
        CarbonStorage.create({
          reservoir,
          soil_category,
          stock_tC_by_ha,
          localisation_category,
          localisation_code,
        }).toDatabaseFormat(),
      );
    });
    rl.on("error", (error: Error) => {
      reject(error);
    });
    rl.on("close", () => {
      console.log(`Carbon storage data parsing completed: ${data.length} lines found`);
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
      .catch(function (error: unknown) {
        console.warn(`Error while inserting carbon storage`);
        console.error(error);
      });
  } catch (error) {
    console.warn(`Error while reading CSV:`);
    console.error(error);
  }
};
