import { BadRequestException, Injectable } from "@nestjs/common";
import { CarbonStorageRepository } from "src/carbon-storage/domain/gateways/CarbonStorageRepository";
import {
  CarbonStorage,
  SoilCategoryType,
} from "src/carbon-storage/domain/models/carbonStorage";

const SOILS_CS = [
  {
    localisation_code: "2_1",
    reservoir: "soil",
    localisation_category: "zpc",
    soil_category: "cultivation",
    stock_tC_by_ha: 50,
  },
  {
    localisation_code: "2_1",
    reservoir: "soil",
    localisation_category: "zpc",
    soil_category: "prairie_bushes",
    stock_tC_by_ha: 69,
  },
  {
    localisation_code: "2_1",
    reservoir: "soil",
    localisation_category: "zpc",
    soil_category: "prairie_trees",
    stock_tC_by_ha: 69,
  },
  {
    localisation_code: "2_1",
    reservoir: "soil",
    localisation_category: "zpc",
    soil_category: "prairie_grass",
    stock_tC_by_ha: 69,
  },
  {
    localisation_code: "2_1",
    reservoir: "soil",
    localisation_category: "zpc",
    soil_category: "forest_deciduous",
    stock_tC_by_ha: 60,
  },
  {
    localisation_code: "2_1",
    reservoir: "soil",
    localisation_category: "zpc",
    soil_category: "forest_poplar",
    stock_tC_by_ha: 60,
  },
  {
    localisation_code: "2_1",
    reservoir: "soil",
    localisation_category: "zpc",
    soil_category: "forest_mixed",
    stock_tC_by_ha: 60,
  },
  {
    localisation_code: "2_1",
    reservoir: "soil",
    localisation_category: "zpc",
    soil_category: "forest_conifer",
    stock_tC_by_ha: 60,
  },
  {
    localisation_code: "2_1",
    reservoir: "soil",
    localisation_category: "zpc",
    soil_category: "forest",
    stock_tC_by_ha: 60,
  },
  {
    localisation_code: "2_1",
    reservoir: "soil",
    localisation_category: "zpc",
    soil_category: "wet_land",
    stock_tC_by_ha: 125,
  },
  {
    localisation_code: "2_1",
    reservoir: "soil",
    localisation_category: "zpc",
    soil_category: "orchard",
    stock_tC_by_ha: 46,
  },
  {
    localisation_code: "2_1",
    reservoir: "soil",
    localisation_category: "zpc",
    soil_category: "vineyard",
    stock_tC_by_ha: 39,
  },
  {
    localisation_code: "2_1",
    reservoir: "soil",
    localisation_category: "zpc",
    soil_category: "impermeable_soils",
    stock_tC_by_ha: 30,
  },
  {
    localisation_code: "2_1",
    reservoir: "soil",
    localisation_category: "zpc",
    soil_category: "artificialised_soils",
    stock_tC_by_ha: 34.5,
  },
  {
    localisation_code: "2_1",
    reservoir: "soil",
    localisation_category: "zpc",
    soil_category: "artificial_grass_or_bushes_filled",
    stock_tC_by_ha: 69,
  },
  {
    localisation_code: "2_1",
    reservoir: "soil",
    localisation_category: "zpc",
    soil_category: "artificial_tree_filled",
    stock_tC_by_ha: 60,
  },
] as CarbonStorage[];

const NON_FOREST_BIOMASS = [
  {
    localisation_code: "84",
    reservoir: "non_forest_biomass",
    localisation_category: "region",
    soil_category: "prairie_trees",
    stock_tC_by_ha: 57,
  },
  {
    localisation_code: "84",
    reservoir: "non_forest_biomass",
    localisation_category: "region",
    soil_category: "prairie_bushes",
    stock_tC_by_ha: 7,
  },
  {
    localisation_code: "84",
    reservoir: "non_forest_biomass",
    localisation_category: "region",
    soil_category: "orchard",
    stock_tC_by_ha: 16,
  },
  {
    localisation_code: "84",
    reservoir: "non_forest_biomass",
    localisation_category: "region",
    soil_category: "vineyard",
    stock_tC_by_ha: 5,
  },
  {
    localisation_code: "84",
    reservoir: "non_forest_biomass",
    localisation_category: "region",
    soil_category: "artificial_tree_filled",
    stock_tC_by_ha: 57,
  },
  {
    localisation_code: "84",
    reservoir: "non_forest_biomass",
    localisation_category: "region",
    soil_category: "artificial_grass_or_bushes_filled",
    stock_tC_by_ha: 7,
  },
];

const FOREST_BIOMASS_GROUPESER_C5 = [
  {
    localisation_code: "84",
    reservoir: "dead_forest_biomass",
    localisation_category: "groupeser",
    soil_category: "forest_deciduous",
    stock_tC_by_ha: 12.09,
  },
  {
    localisation_code: "84",
    reservoir: "live_forest_biomass",
    localisation_category: "groupeser",
    soil_category: "forest_deciduous",
    stock_tC_by_ha: 104.78,
  },
];

const FOREST_BIOMASS_GRECO_C = [
  {
    localisation_code: "C",
    reservoir: "dead_forest_biomass",
    localisation_category: "greco",
    soil_category: "forest_conifer",
    stock_tC_by_ha: 6.73,
  },
  {
    localisation_code: "C",
    reservoir: "live_forest_biomass",
    localisation_category: "greco",
    soil_category: "forest_conifer",
    stock_tC_by_ha: 85.84,
  },
  {
    localisation_code: "C",
    reservoir: "dead_forest_biomass",
    localisation_category: "greco",
    soil_category: "forest_mixed",
    stock_tC_by_ha: 8.57,
  },
  {
    localisation_code: "C",
    reservoir: "live_forest_biomass",
    localisation_category: "greco",
    soil_category: "forest_mixed",
    stock_tC_by_ha: 93.75,
  },
];

const FOREST_BIOMASS_COUNTRY = [
  {
    localisation_code: "France",
    reservoir: "dead_forest_biomass",
    localisation_category: "pays",
    soil_category: "forest_poplar",
    stock_tC_by_ha: 3.48,
  },
  {
    localisation_code: "France",
    reservoir: "live_forest_biomass",
    localisation_category: "pays",
    soil_category: "forest_poplar",
    stock_tC_by_ha: 60.95,
  },
];

const LITTER = [
  {
    localisation_code: "France",
    localisation_category: "pays",
    soil_category: "forest_poplar",
    stock_tC_by_ha: 9,
    reservoir: "litter",
  },
  {
    localisation_code: "France",
    localisation_category: "pays",
    soil_category: "forest_mixed",
    stock_tC_by_ha: 9,
    reservoir: "litter",
  },
  {
    localisation_code: "France",
    localisation_category: "pays",
    soil_category: "forest_deciduous",
    stock_tC_by_ha: 9,
    reservoir: "litter",
  },
  {
    localisation_code: "France",
    localisation_category: "pays",
    soil_category: "forest_conifer",
    stock_tC_by_ha: 9,
    reservoir: "litter",
  },
];

const CITIES = {
  "01026": [
    ...SOILS_CS,
    ...NON_FOREST_BIOMASS,
    ...FOREST_BIOMASS_COUNTRY,
    ...LITTER,
  ],
  "01027": [
    ...SOILS_CS,
    ...NON_FOREST_BIOMASS,
    ...FOREST_BIOMASS_GROUPESER_C5,
    ...FOREST_BIOMASS_GRECO_C,
    ...FOREST_BIOMASS_COUNTRY,
    ...LITTER,
  ],
};

@Injectable()
export class LocalCarbonStorageRepository implements CarbonStorageRepository {
  async getCarbonStorageForCity(
    cityCode: "01026" | "01027",
    soils: SoilCategoryType[],
  ): Promise<CarbonStorage[]> {
    if (cityCode.length === 0) {
      throw new BadRequestException();
    }

    const city = CITIES[cityCode] as CarbonStorage[];

    try {
      return new Promise((resolve) => {
        resolve(city.filter((entry) => soils.includes(entry.soil_category)));
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
