import type { Knex } from "knex";
import knex from "knex";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { SqlCityStatsQuery } from "./SqlCityStatsQuery";

describe("SqlCityStatsQuery", () => {
  let sqlConnection: Knex;
  let repository: SqlCityStatsQuery;

  before(() => {
    sqlConnection = knex(knexConfig);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    repository = new SqlCityStatsQuery(sqlConnection);
  });

  describe("getCityStats propertyValueMedianPricePerSquareMeters", () => {
    it("it should return default value if city is not found", async () => {
      const result = await repository.getCityStats("wrong");

      assert.strictEqual(result.propertyValueMedianPricePerSquareMeters, 2185);
    });

    it("it should return the right value for propertyValueMedianPricePerSquareMeters", async () => {
      const result = await repository.getCityStats("54321");

      assert.strictEqual(result.propertyValueMedianPricePerSquareMeters, 2339);
    });

    it("it should return default value for city of less than 150 inhabitants for city in department 57", async () => {
      const result = await repository.getCityStats("57691");

      assert.strictEqual(result.propertyValueMedianPricePerSquareMeters, 1513);
    });

    it("it should return default value for city of less than 1500 inhabitants for city in department 57", async () => {
      const result = await repository.getCityStats("57680");
      assert.strictEqual(result.propertyValueMedianPricePerSquareMeters, 1826);
    });
  });

  describe("getCityStats squareMetersSurfaceArea & population", () => {
    it("it should return default value if error occured", async () => {
      const result = await repository.getCityStats("inconnu");

      assert.strictEqual(result.surfaceAreaSquareMeters, 14900000);
      assert.strictEqual(result.population, 1800);
    });

    it("it should return population and surface area in square meters", async () => {
      const result = await repository.getCityStats("54321");

      assert.strictEqual(result.surfaceAreaSquareMeters, 3152100);
      assert.strictEqual(result.population, 2373);
    });
  });
});
