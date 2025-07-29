import { Knex } from "knex";

import { readCityStatsCsvData } from "../scripts/read-city-stats-csv";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("city_stats").del();

  try {
    const data = await readCityStatsCsvData();

    await knex
      .batchInsert("city_stats", data, 1000)
      .returning("city_code")
      .then(function (cityCodes) {
        console.log(`${cityCodes.length} city_stats inserted`);
      })
      .catch(function (error: unknown) {
        console.warn(`Error while inserting city_stats`);
        console.error(error);
      });
  } catch (error) {
    console.warn(`Error while reading CSV:`);
    console.error(error);
  }
}
