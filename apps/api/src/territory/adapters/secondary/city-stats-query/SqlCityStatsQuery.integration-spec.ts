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

  describe("getCityStats propertyValueMedianPricePerSquareMeters", () => {
    test("it should return default value if city is not found", async () => {
      const result = await repository.getCityStats("wrong");

      expect(result.propertyValueMedianPricePerSquareMeters).toEqual(2185);
    });

    test("it should return the right value for propertyValueMedianPricePerSquareMeters", async () => {
      const result = await repository.getCityStats("54321");

      expect(result.propertyValueMedianPricePerSquareMeters).toEqual(2339);
    });

    test("it should return default value for city of less than 150 inhabitants for city in department 57", async () => {
      const result = await repository.getCityStats("57691");

      expect(result.propertyValueMedianPricePerSquareMeters).toEqual(1513);
    });

    test("it should return default value for city of less than 1500 inhabitants for city in department 57", async () => {
      const result = await repository.getCityStats("57680");
      expect(result.propertyValueMedianPricePerSquareMeters).toEqual(1826);
    });
  });

  describe("getCityStats squareMetersSurfaceArea & population", () => {
    test("it should return default value if error occured", async () => {
      const result = await repository.getCityStats("inconnu");

      expect(result.surfaceAreaSquareMeters).toEqual(14900000);
      expect(result.population).toEqual(1800);
    });

    test("it should return population and surface area in square meters", async () => {
      const result = await repository.getCityStats("54321");

      expect(result.surfaceAreaSquareMeters).toEqual(3152100);
      expect(result.population).toEqual(2373);
    });
  });
});
