import { Knex } from "knex";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

import { City, CityProps } from "./../../../../carbon-storage/core/models/city";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const dataPath = path.resolve(__dirname, "./../../../../../data/aldo/cities.csv");

const HEADER =
  "insee;name;department;region;epci;zpc;code_greco;code_groupeser;code_ser;code_bassin_populicole";

const readCsvData = async () => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(dataPath, "utf-8");
    const rl = readline.createInterface({ input: readStream });
    const data: CityProps[] = [];

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
        codeGreco,
        codeSerGroup,
        codeSer,
        codePoplarPool,
      ] = line.split(";") as [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
      ];
      const city = City.create({
        insee,
        name,
        department,
        region,
        zpc,
        epci,
        code_greco: codeGreco.split(","),
        code_ser: codeSer.split(","),
        code_groupeser: codeSerGroup.split(","),
        code_bassin_populicole: codePoplarPool,
      });
      data.push(city.toDatabaseFormat());
    });
    rl.on("error", (error: Error) => {
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
      .catch(function (error: unknown) {
        console.warn(`Error while inserting cities`);
        console.error(error);
      });
  } catch (error) {
    console.warn(`Error while reading CSV:`);
    console.error(error);
  }
};
