import knex, { type Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { SqlCityImpactsQuery } from "./SqlCityImpactsQuery";

describe("SqlCityImpactsQuery", () => {
  let sqlConnection: Knex;
  let repository: SqlCityImpactsQuery;

  before(() => {
    sqlConnection = knex(knexConfig);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    repository = new SqlCityImpactsQuery(sqlConnection);
  });

  describe("getCityDataAndStats propertyValueMedianPricePerSquareMeters", () => {
    it("it should return default value if city is not found", async () => {
      const result = await repository.getCityDataAndStats("wrong");

      assert.strictEqual(result.stats.propertyValueMedianPricePerSquareMeters, 2185);
    });

    it("it should return the right value for propertyValueMedianPricePerSquareMeters", async () => {
      const result = await repository.getCityDataAndStats("54321");

      assert.strictEqual(result.stats.propertyValueMedianPricePerSquareMeters, 2397);
    });

    it("it should return default value for city of less than 150 inhabitants for city in department 57", async () => {
      const result = await repository.getCityDataAndStats("57691");

      assert.strictEqual(result.stats.propertyValueMedianPricePerSquareMeters, 1513);
    });

    it("it should return default value for city of less than 1500 inhabitants for city in department 57", async () => {
      const result = await repository.getCityDataAndStats("57680");
      assert.strictEqual(result.stats.propertyValueMedianPricePerSquareMeters, 1826);
    });
  });

  describe("getCityDataAndStats squareMetersSurfaceArea & population", () => {
    it("should return default value if error occured", async () => {
      const result = await repository.getCityDataAndStats("inconnu");

      assert.strictEqual(result.stats.surfaceAreaSquareMeters, 14900000);
      assert.strictEqual(result.stats.population, 1800);
    });

    it("should return population and surface area in square meters", async () => {
      const result = await repository.getCityDataAndStats("54321");

      assert.strictEqual(result.stats.surfaceAreaSquareMeters, 3152100);
      assert.strictEqual(result.stats.population, 2377);
    });
  });

  describe("getCityDataAndStats mteZonageAbc and isRural", () => {
    it("should return isRural false and mteZonageAbc undefined", async () => {
      const result = await repository.getCityDataAndStats("inconnu");

      assert.strictEqual(result.mteZonageAbc, undefined);
      assert.strictEqual(result.isRural, false);
    });

    it("should return isRural false and mteZonageAbc undefined for DOM TOM city", async () => {
      const result = await repository.getCityDataAndStats("97502");

      assert.strictEqual(result.mteZonageAbc, undefined);
      assert.strictEqual(result.isRural, false);
    });

    it("should return isRural true and mteZonageAbc 'C'", async () => {
      const result = await repository.getCityDataAndStats("38112");

      assert.strictEqual(result.mteZonageAbc, "C");
      assert.strictEqual(result.isRural, true);
    });

    it("should return isRural false and mteZonageAbc 'Abis'", async () => {
      const result = await repository.getCityDataAndStats("75101");

      assert.strictEqual(result.mteZonageAbc, "Abis");
      assert.strictEqual(result.isRural, false);
    });
  });
});
