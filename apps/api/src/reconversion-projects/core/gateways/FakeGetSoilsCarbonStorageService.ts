import { roundTo2Digits, sumObjectValues, typedObjectEntries } from "shared";

import {
  GetCarbonStorageFromSoilDistributionService,
  SoilsCarbonStorage,
  SoilsCarbonStorageInput,
} from "./SoilsCarbonStorageService";

const CARBON_STORAGE = {
  BUILDINGS: 0,
  IMPERMEABLE_SOILS: 0,
  MINERAL_SOIL: 5,
  ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 8,
  ARTIFICIAL_TREE_FILLED: 10,
  FOREST_DECIDUOUS: 20,
  FOREST_CONIFER: 20,
  FOREST_POPLAR: 20,
  FOREST_MIXED: 20,
  PRAIRIE_GRASS: 15,
  PRAIRIE_BUSHES: 15,
  PRAIRIE_TREES: 15,
  ORCHARD: 8,
  CULTIVATION: 8,
  VINEYARD: 8,
  WET_LAND: 3,
  WATER: 0,
};
export class FakeGetSoilsCarbonStorageService implements GetCarbonStorageFromSoilDistributionService {
  result: SoilsCarbonStorage | null = null;
  _isShouldFailOnExecute = false;

  _setResult(result: SoilsCarbonStorage) {
    this.result = result;
  }

  shouldFailOnExecute() {
    this._isShouldFailOnExecute = true;
  }

  execute({ soilsDistribution }: SoilsCarbonStorageInput): Promise<SoilsCarbonStorage | undefined> {
    if (this._isShouldFailOnExecute) {
      return Promise.resolve(undefined);
    }
    const soilsCarbonStorage = {};

    typedObjectEntries(soilsDistribution).forEach(([type, surfaceArea]) => {
      Object.assign(soilsCarbonStorage, { [type]: CARBON_STORAGE[type] * (surfaceArea ?? 0) });
    });

    return Promise.resolve(
      this.result ?? {
        total: roundTo2Digits(sumObjectValues(soilsCarbonStorage)),
        ...soilsCarbonStorage,
      },
    );
  }
}
