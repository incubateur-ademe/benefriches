import type { Knex } from "knex";

import { readCitiesCsvData } from "../scripts/read-cities-csv";

export async function seed(knex: Knex): Promise<void> {
  await knex("cities").del();
  try {
    const data = await readCitiesCsvData();

    await knex
      .batchInsert("cities", data, 1000)
      .returning("city_code")
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
}
