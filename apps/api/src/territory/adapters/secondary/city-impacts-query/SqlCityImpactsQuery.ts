import { Inject, Logger } from "@nestjs/common";
import type { Knex } from "knex";
import { convertHectaresToSquareMeters } from "shared";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import {
  CityStats,
  SqlCity,
  SqlFranceRuralite,
} from "src/shared-kernel/adapters/sql-knex/tableTypes";
import {
  CityImpactsData,
  CityImpactsDataProvider,
} from "src/territory/core/gateways/CityImpactsDataProvider";

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

type CityStatsQueryResult = {
  name: SqlCity["name"];
  mte_zonage_abc: SqlCity["mte_zonage_abc"];
  da_name: CityStats["da_name"] | null;
  da_population: CityStats["da_population"] | null;
  da_surface_ha: CityStats["da_surface_ha"] | null;
  dvf_pxm2_median: CityStats["dvf_pxm2_median"] | null;
  dvf_pxm2_median_terrain: CityStats["dvf_pxm2_median_terrain"] | null;
  anct_part_actifs_transports_en_commun_2022:
    | CityStats["anct_part_actifs_transports_en_commun_2022"]
    | null;
  anct_taux_annuel_evol_population_2016_2022:
    | CityStats["anct_taux_annuel_evol_population_2016_2022"]
    | null;
  is_rural: SqlFranceRuralite["city_code"] | null;
};

export class SqlCityImpactsQuery implements CityImpactsDataProvider {
  private readonly logger = new Logger(SqlCityImpactsQuery.name);

  private readonly sqlConnection: Knex;
  constructor(@Inject(SqlConnection) sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  async getCityDataAndStats(cityCode: string): Promise<CityImpactsData> {
    try {
      const result = (await this.sqlConnection<CityStatsQueryResult>("cities")
        .select(
          "cities.name",
          "cities.mte_zonage_abc",
          "city_stats.da_name",
          "city_stats.da_population",
          "city_stats.da_surface_ha",
          "city_stats.dvf_pxm2_median",
          "city_stats.dvf_pxm2_median_terrain",
          "city_stats.anct_part_actifs_transports_en_commun_2022",
          "city_stats.anct_taux_annuel_evol_population_2016_2022",
          "france_ruralites.city_code as is_rural",
        )
        .leftJoin("city_stats", "city_stats.city_code", "cities.city_code")
        .leftJoin("france_ruralites", "france_ruralites.city_code", "cities.city_code")
        .where("cities.city_code", cityCode)
        .first()) as CityStatsQueryResult | undefined;

      if (!result) {
        throw new Error(`SqlCityImpactsQuery: City with city_code ${cityCode} not found`);
      }

      const surfaceAreaSquareMeters = result?.da_surface_ha
        ? convertHectaresToSquareMeters(result.da_surface_ha)
        : FRANCE_AVERAGE_CITY_SQUARE_METERS_AREA;

      const population = result?.da_population ?? FRANCE_AVERAGE_CITY_POPULATION;

      const statsAccuracy = !result?.dvf_pxm2_median || !result?.da_population ? "france" : "city";

      return {
        name: result?.name ?? result?.da_name ?? "",
        mteZonageAbc:
          !result?.mte_zonage_abc || result?.mte_zonage_abc === ""
            ? undefined
            : (result?.mte_zonage_abc as "A" | "B" | "C" | "B1" | "B2" | "Abis"),
        isRural: Boolean(result.is_rural),
        stats: {
          accuracy: statsAccuracy,
          surfaceAreaSquareMeters,
          population,
          propertyValueMedianPricePerSquareMeters:
            result.dvf_pxm2_median && result.dvf_pxm2_median !== 0
              ? result.dvf_pxm2_median
              : getDefaultMedianPriceFromPopulation(population),
          landWithoutBuildingsMedianPricePerSquareMeters:
            result["dvf_pxm2_median_terrain"] ?? undefined,
          shareOfWorkTripsByPublicTransport:
            result["anct_part_actifs_transports_en_commun_2022"] ?? undefined,
          annualRateOfPopulationChange:
            result["anct_taux_annuel_evol_population_2016_2022"] ?? undefined,
        },
      };
    } catch (err) {
      this.logger.warn(String(err));
      return {
        name: "",
        isRural: false,
        stats: {
          accuracy: "france",
          surfaceAreaSquareMeters: FRANCE_AVERAGE_CITY_SQUARE_METERS_AREA,
          population: FRANCE_AVERAGE_CITY_POPULATION,
          propertyValueMedianPricePerSquareMeters: getDefaultMedianPriceFromPopulation(
            FRANCE_AVERAGE_CITY_POPULATION,
          ),
          shareOfWorkTripsByPublicTransport: undefined,
          annualRateOfPopulationChange: undefined,
          landWithoutBuildingsMedianPricePerSquareMeters: undefined,
        },
      };
    }
  }
}
