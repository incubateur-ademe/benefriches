import { Inject } from "@nestjs/common";
import { Knex } from "knex";
import { convertHectaresToSquareMeters } from "shared";

import {
  CityStats,
  CityStatsProvider,
} from "src/reconversion-projects/core/gateways/CityStatsProvider";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

const FRANCE_AVERAGE_CITY_POPULATION = 1800;
const FRANCE_AVERAGE_CITY_SQUARE_METERS_AREA = 14900000;

const getDefaultMedianPriceFromPopulation = (population: number) => {
  if (population < 501) {
    return 1513;
  }
  if (population < 1501) {
    return 1826;
  }
  if (population < 3001) {
    return 2185;
  }
  if (population < 10001) {
    return 2571;
  }
  if (population < 50001) {
    return 3188;
  }
  if (population < 100000) {
    return 3727;
  }
  return 3466;
};

export class SqlCityStatsQuery implements CityStatsProvider {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async getCityStats(cityCode: string): Promise<CityStats> {
    try {
      const stats = await this.sqlConnection("city_stats")
        .select("da_name", "da_population", "da_surface_ha", "dvf_pxm2_median")
        .where("city_code", cityCode)
        .first();

      if (!stats) {
        throw new Error(`SqlCityStatsQuery: City with city_code ${cityCode} not found`);
      }

      const surfaceAreaSquareMeters = stats.da_surface_ha
        ? convertHectaresToSquareMeters(stats.da_surface_ha)
        : FRANCE_AVERAGE_CITY_SQUARE_METERS_AREA;
      const population = stats.da_population;

      return {
        name: stats.da_name,
        surfaceAreaSquareMeters,
        population,
        propertyValueMedianPricePerSquareMeters:
          stats.dvf_pxm2_median && stats.dvf_pxm2_median !== 0
            ? stats.dvf_pxm2_median
            : getDefaultMedianPriceFromPopulation(population),
      };
    } catch (err) {
      console.warn(err);
      return {
        name: "",
        surfaceAreaSquareMeters: FRANCE_AVERAGE_CITY_SQUARE_METERS_AREA,
        population: FRANCE_AVERAGE_CITY_POPULATION,
        propertyValueMedianPricePerSquareMeters: getDefaultMedianPriceFromPopulation(
          FRANCE_AVERAGE_CITY_POPULATION,
        ),
      };
    }
  }
}
