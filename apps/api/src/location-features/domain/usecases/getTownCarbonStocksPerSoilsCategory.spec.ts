import { CarbonStocksPerSoilsCategoryService } from "src/location-features/adapters/secondary/town-data-provider/CarbonStocksPerSoilsCategoryService";
import { GetTownCarbonStocksPerSoilsCategoryUseCase } from "./getTownCarbonStocksPerSoilsCategory";

describe("GetTownCarbonStocksPerSoilsCategoryUseCase", () => {
  let carbonStocksDataProvider: CarbonStocksPerSoilsCategoryService;

  beforeEach(() => {
    carbonStocksDataProvider = new CarbonStocksPerSoilsCategoryService();
  });

  test("it should return the right object format", async () => {
    const usecase = new GetTownCarbonStocksPerSoilsCategoryUseCase(
      carbonStocksDataProvider,
    );
    const result = await usecase.execute({ cityCode: "54321" });

    expect(result).toBeDefined();
    expect(result.cityCode).toEqual("54321");
    expect(result.stocks).toBeDefined();
    expect(result.zpcCode).toBeDefined();
  });
});
