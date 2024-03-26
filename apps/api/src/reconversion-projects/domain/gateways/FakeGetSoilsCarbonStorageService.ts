import { Response as SoilsCarbonStorageResult } from "src/carbon-storage/domain/usecases/getCityCarbonStoragePerSoilsCategory";
import { GetSoilsCarbonStoragePerSoilsService } from "../model/impacts/soils-carbon-storage/soilsCarbonStorageImpact";

export const resultMock: SoilsCarbonStorageResult = {
  totalCarbonStorage: 20,
  soilsCarbonStorage: [
    {
      type: "IMPERMEABLE_SOILS",
      carbonStorage: 2,
      surfaceArea: 1000,
      carbonStorageInTonPerSquareMeters: 0.002,
    },
    {
      type: "BUILDINGS",
      carbonStorage: 2,
      surfaceArea: 1000,
      carbonStorageInTonPerSquareMeters: 0.002,
    },
    {
      type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      carbonStorage: 16,
      surfaceArea: 1000,
      carbonStorageInTonPerSquareMeters: 62.5,
    },
  ],
} as const;

export class FakeGetSoilsCarbonStorageService implements GetSoilsCarbonStoragePerSoilsService {
  result: SoilsCarbonStorageResult | null = null;

  _setResult(result: SoilsCarbonStorageResult) {
    this.result = result;
  }

  execute(): Promise<SoilsCarbonStorageResult> {
    return Promise.resolve(this.result ?? resultMock);
  }
}
