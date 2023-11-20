import { BadRequestException, Injectable } from "@nestjs/common";
import { CarbonStorageRepository } from "src/carbon-storage/domain/gateways/CarbonStorageRepository";
import {
  CarbonStorage,
  RepositorySoilCategoryType,
} from "src/carbon-storage/domain/models/carbonStorage";

const SOILS_CS = [
  {
    localisationCode: "2_1",
    reservoir: "soil",
    localisationCategory: "zpc",
    soilCategory: "cultivation",
    carbonStorageInTonByHectare: 50,
  },
  {
    localisationCode: "2_1",
    reservoir: "soil",
    localisationCategory: "zpc",
    soilCategory: "prairie_bushes",
    carbonStorageInTonByHectare: 69,
  },
  {
    localisationCode: "2_1",
    reservoir: "soil",
    localisationCategory: "zpc",
    soilCategory: "prairie_trees",
    carbonStorageInTonByHectare: 69,
  },
  {
    localisationCode: "2_1",
    reservoir: "soil",
    localisationCategory: "zpc",
    soilCategory: "prairie_grass",
    carbonStorageInTonByHectare: 69,
  },
  {
    localisationCode: "2_1",
    reservoir: "soil",
    localisationCategory: "zpc",
    soilCategory: "forest_deciduous",
    carbonStorageInTonByHectare: 60,
  },
  {
    localisationCode: "2_1",
    reservoir: "soil",
    localisationCategory: "zpc",
    soilCategory: "forest_poplar",
    carbonStorageInTonByHectare: 60,
  },
  {
    localisationCode: "2_1",
    reservoir: "soil",
    localisationCategory: "zpc",
    soilCategory: "forest_mixed",
    carbonStorageInTonByHectare: 60,
  },
  {
    localisationCode: "2_1",
    reservoir: "soil",
    localisationCategory: "zpc",
    soilCategory: "forest_conifer",
    carbonStorageInTonByHectare: 60,
  },
  {
    localisationCode: "2_1",
    reservoir: "soil",
    localisationCategory: "zpc",
    soilCategory: "forest",
    carbonStorageInTonByHectare: 60,
  },
  {
    localisationCode: "2_1",
    reservoir: "soil",
    localisationCategory: "zpc",
    soilCategory: "wet_land",
    carbonStorageInTonByHectare: 125,
  },
  {
    localisationCode: "2_1",
    reservoir: "soil",
    localisationCategory: "zpc",
    soilCategory: "orchard",
    carbonStorageInTonByHectare: 46,
  },
  {
    localisationCode: "2_1",
    reservoir: "soil",
    localisationCategory: "zpc",
    soilCategory: "vineyard",
    carbonStorageInTonByHectare: 39,
  },
  {
    localisationCode: "2_1",
    reservoir: "soil",
    localisationCategory: "zpc",
    soilCategory: "impermeable_soils",
    carbonStorageInTonByHectare: 30,
  },
  {
    localisationCode: "2_1",
    reservoir: "soil",
    localisationCategory: "zpc",
    soilCategory: "artificialised_soils",
    carbonStorageInTonByHectare: 34.5,
  },
  {
    localisationCode: "2_1",
    reservoir: "soil",
    localisationCategory: "zpc",
    soilCategory: "artificial_grass_or_bushes_filled",
    carbonStorageInTonByHectare: 69,
  },
  {
    localisationCode: "2_1",
    reservoir: "soil",
    localisationCategory: "zpc",
    soilCategory: "artificial_tree_filled",
    carbonStorageInTonByHectare: 60,
  },
] as CarbonStorage[];

const NON_FOREST_BIOMASS = [
  {
    localisationCode: "84",
    reservoir: "non_forest_biomass",
    localisationCategory: "region",
    soilCategory: "prairie_trees",
    carbonStorageInTonByHectare: 57,
  },
  {
    localisationCode: "84",
    reservoir: "non_forest_biomass",
    localisationCategory: "region",
    soilCategory: "prairie_bushes",
    carbonStorageInTonByHectare: 7,
  },
  {
    localisationCode: "84",
    reservoir: "non_forest_biomass",
    localisationCategory: "region",
    soilCategory: "orchard",
    carbonStorageInTonByHectare: 16,
  },
  {
    localisationCode: "84",
    reservoir: "non_forest_biomass",
    localisationCategory: "region",
    soilCategory: "vineyard",
    carbonStorageInTonByHectare: 5,
  },
  {
    localisationCode: "84",
    reservoir: "non_forest_biomass",
    localisationCategory: "region",
    soilCategory: "artificial_tree_filled",
    carbonStorageInTonByHectare: 57,
  },
  {
    localisationCode: "84",
    reservoir: "non_forest_biomass",
    localisationCategory: "region",
    soilCategory: "artificial_grass_or_bushes_filled",
    carbonStorageInTonByHectare: 7,
  },
];

const FOREST_BIOMASS_GROUPESER_C5 = [
  {
    localisationCode: "84",
    reservoir: "dead_forest_biomass",
    localisationCategory: "groupeser",
    soilCategory: "forest_deciduous",
    carbonStorageInTonByHectare: 12.09,
  },
  {
    localisationCode: "84",
    reservoir: "live_forest_biomass",
    localisationCategory: "groupeser",
    soilCategory: "forest_deciduous",
    carbonStorageInTonByHectare: 104.78,
  },
];

const FOREST_BIOMASS_GRECO_C = [
  {
    localisationCode: "C",
    reservoir: "dead_forest_biomass",
    localisationCategory: "greco",
    soilCategory: "forest_conifer",
    carbonStorageInTonByHectare: 6.73,
  },
  {
    localisationCode: "C",
    reservoir: "live_forest_biomass",
    localisationCategory: "greco",
    soilCategory: "forest_conifer",
    carbonStorageInTonByHectare: 85.84,
  },
  {
    localisationCode: "C",
    reservoir: "dead_forest_biomass",
    localisationCategory: "greco",
    soilCategory: "forest_mixed",
    carbonStorageInTonByHectare: 8.57,
  },
  {
    localisationCode: "C",
    reservoir: "live_forest_biomass",
    localisationCategory: "greco",
    soilCategory: "forest_mixed",
    carbonStorageInTonByHectare: 93.75,
  },
];

const FOREST_BIOMASS_COUNTRY = [
  {
    localisationCode: "France",
    reservoir: "dead_forest_biomass",
    localisationCategory: "pays",
    soilCategory: "forest_poplar",
    carbonStorageInTonByHectare: 3.48,
  },
  {
    localisationCode: "France",
    reservoir: "live_forest_biomass",
    localisationCategory: "pays",
    soilCategory: "forest_poplar",
    carbonStorageInTonByHectare: 60.95,
  },
];

const LITTER = [
  {
    localisationCode: "France",
    localisationCategory: "pays",
    soilCategory: "forest_poplar",
    carbonStorageInTonByHectare: 9,
    reservoir: "litter",
  },
  {
    localisationCode: "France",
    localisationCategory: "pays",
    soilCategory: "forest_mixed",
    carbonStorageInTonByHectare: 9,
    reservoir: "litter",
  },
  {
    localisationCode: "France",
    localisationCategory: "pays",
    soilCategory: "forest_deciduous",
    carbonStorageInTonByHectare: 9,
    reservoir: "litter",
  },
  {
    localisationCode: "France",
    localisationCategory: "pays",
    soilCategory: "forest_conifer",
    carbonStorageInTonByHectare: 9,
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
    soils: RepositorySoilCategoryType[],
  ): Promise<CarbonStorage[]> {
    if (cityCode.length === 0) {
      throw new BadRequestException();
    }

    const city = CITIES[cityCode] as CarbonStorage[];

    try {
      return new Promise((resolve) => {
        resolve(city.filter((entry) => soils.includes(entry.soilCategory)));
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
