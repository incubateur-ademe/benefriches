import fs from "fs";
import { Knex } from "knex";
import path from "path";
import readline from "readline";
import { City } from "./../../../../carbon-storage/domain/models/city";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const dataPath = path.resolve(__dirname, "./../../../../../data/cities.csv");

const HEADER =
  "insee;name;department;region,epci;zpc;code_greco;code_groupeser;code_ser;code_bassin_populicole";

const readCsvData = async () => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(dataPath, "utf-8");
    const rl = readline.createInterface({ input: readStream });
    const data: City[] = [];

    rl.on("line", (line) => {
      if (line === HEADER) {
        return;
      }
      const [
        insee,
        name,
        department,
        region,
        epci,
        zpc,
        code_greco,
        code_groupeser,
        code_ser,
        code_bassin_populicole,
      ] = line.split(";");
      data.push(
        City.create({
          insee,
          name,
          department,
          region,
          zpc,
          epci,
          code_greco: code_greco.split(","),
          code_ser: code_ser.split(","),
          code_groupeser: code_groupeser.split(","),
          code_bassin_populicole,
        }),
      );
    });
    rl.on("error", (error) => {
      reject(error);
    });
    rl.on("close", () => {
      console.log(`Data parsing completed: ${data.length} cities found`);
      resolve(data);
    });
  });
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
exports.seed = async function (knex: Knex): Promise<void> {
  await knex("cities").del();
  try {
    const data = (await readCsvData()) as City[];

    await knex
      .batchInsert("cities", data, 1000)
      .returning("insee")
      .then(function (ids) {
        console.log(`${ids.length} cities inserted`);
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
