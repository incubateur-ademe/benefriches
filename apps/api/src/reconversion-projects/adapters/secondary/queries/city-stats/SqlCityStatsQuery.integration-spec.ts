import knex, { Knex } from "knex";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { SqlCityStatsQuery } from "./SqlCityStatsQuery";

describe("SqlCityStatsQuery", () => {
  let sqlConnection: Knex;
  let repository: SqlCityStatsQuery;

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    repository = new SqlCityStatsQuery(sqlConnection);
  });

  describe("getCityStats residentialPropertyMedianPricePerSquareMeters", () => {
    test("it should return default value if city is not found", async () => {
      const result = await repository.getCityStats("wrong");

      expect(result.residentialPropertyMedianPricePerSquareMeters).toEqual(2185);
    });

    test("it should return the right value for residentialPropertyMedianPricePerSquareMeters", async () => {
      const result = await repository.getCityStats("54321");

      expect(result.residentialPropertyMedianPricePerSquareMeters).toEqual(2380);
    });

    test("it should return default value for city of less than 150 inhabitants for city in department 57", async () => {
      const result = await repository.getCityStats("57691");

      expect(result.residentialPropertyMedianPricePerSquareMeters).toEqual(1513);
    });

    test("it should return default value for city of less than 1500 inhabitants for city in department 57", async () => {
      const result = await repository.getCityStats("57680");
      expect(result.residentialPropertyMedianPricePerSquareMeters).toEqual(1826);
    });
  });

  describe("getCityStats landValueMedianPricePerSquareMeters", () => {
    test("it should return terrain price when available", async () => {
      const result = await repository.getCityStats("54321");

      expect(result.landValueMedianPricePerSquareMeters).toEqual(707);
    });

    test("it should return null when terrain price is not available", async () => {
      const result = await repository.getCityStats("57691");

      expect(result.landValueMedianPricePerSquareMeters).toBeNull();
    });

    test("it should return null on fallback for unknown city", async () => {
      const result = await repository.getCityStats("inconnu");

      expect(result.landValueMedianPricePerSquareMeters).toBeNull();
    });
  });

  describe("getCityStats squareMetersSurfaceArea & population", () => {
    test("it should return default value if error occured", async () => {
      const result = await repository.getCityStats("inconnu");

      expect(result.surfaceAreaSquareMeters).toEqual(14900000);
      expect(result.population).toEqual(1800);
    });
  });
});
