import type { SuccessResult } from "src/shared-kernel/result";
import { InMemoryCityRuralityQuery } from "src/territory/adapters/secondary/city-rurality-query/InMemoryCityRuralityQuery";

import { GetCityRuralityUseCase } from "./getCityRurality.usecase";

type CityRuralityData = { cityCode: string; isRural: boolean };

describe("GetCityRurality UseCase", () => {
  it("returns isRural true when the city is in the rural list", async () => {
    const cityRuralityQuery = new InMemoryCityRuralityQuery();
    cityRuralityQuery._setRuralCityCodes(["01029"]);
    const usecase = new GetCityRuralityUseCase(cityRuralityQuery);

    const result = await usecase.execute({ cityCode: "01029" });

    expect(result.isSuccess()).toBe(true);
    expect((result as SuccessResult<CityRuralityData>).getData()).toEqual({
      cityCode: "01029",
      isRural: true,
    });
  });

  it("returns isRural false when the city is not in the rural list", async () => {
    const cityRuralityQuery = new InMemoryCityRuralityQuery();
    cityRuralityQuery._setRuralCityCodes(["01029"]);
    const usecase = new GetCityRuralityUseCase(cityRuralityQuery);

    const result = await usecase.execute({ cityCode: "01001" });

    expect(result.isSuccess()).toBe(true);
    expect((result as SuccessResult<CityRuralityData>).getData()).toEqual({
      cityCode: "01001",
      isRural: false,
    });
  });
});
