import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GetCityReferenceDataResponseDto } from "shared";

import type { SuccessResult } from "src/shared-kernel/result";
import { InMemoryCityImpactsQuery } from "src/territory/adapters/secondary/city-impacts-query/InMemoryCityImpactsQuery";

import { GetCityReferenceDataUseCase } from "./getCityReferenceData.usecase";

describe("GetCityRurality UseCase", () => {
  it("returns isRural true when the city is in the rural list", async () => {
    const cityReferenceDataQuery = new InMemoryCityImpactsQuery();
    const usecase = new GetCityReferenceDataUseCase(cityReferenceDataQuery);

    const result = await usecase.execute({ cityCode: "01039" });

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual((result as SuccessResult<GetCityReferenceDataResponseDto>).getData(), {
      cityCode: "01039",
      isRural: true,
      landAndRealEstateValues: {
        propertyValueMedianPricePerSquareMeters: 2500,
        landWithoutBuildingsMedianPricePerSquareMeters: undefined,
        accuracy: "city",
      },
      population: 1800,
    });
  });

  it("returns isRural false when the city is not in the rural list", async () => {
    const cityRuralityQuery = new InMemoryCityImpactsQuery();
    const usecase = new GetCityReferenceDataUseCase(cityRuralityQuery);

    const result = await usecase.execute({ cityCode: "01001" });

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual((result as SuccessResult<GetCityReferenceDataResponseDto>).getData(), {
      cityCode: "01001",
      isRural: false,
      landAndRealEstateValues: {
        propertyValueMedianPricePerSquareMeters: 3064,
        landWithoutBuildingsMedianPricePerSquareMeters: undefined,
        accuracy: "france",
      },
      population: 1800,
    });
  });
});
