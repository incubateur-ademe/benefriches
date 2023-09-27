import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CarbonStocksPerSoilsCategoryService } from "./CarbonStocksPerSoilsCategoryService";

describe("CarbonStocksPerSoilsCategoryService", () => {
  describe("getTownZpcCode", () => {
    test("it should throw BadRequestException if no cityCode is provided", async () => {
      const service = new CarbonStocksPerSoilsCategoryService();
      await expect(() => service.getTownZpcCode("")).rejects.toThrow(
        BadRequestException,
      );
    });

    test("it should throw NotFoundException if a wrong cityCode is provided", async () => {
      const service = new CarbonStocksPerSoilsCategoryService();
      await expect(() =>
        service.getTownZpcCode("Wrong cityCode"),
      ).rejects.toThrow(NotFoundException);
    });

    test("it should return the right zpc for Toulouse", async () => {
      const service = new CarbonStocksPerSoilsCategoryService();
      const result = await service.getTownZpcCode("54321");

      expect(result).toBeDefined();
      expect(result).toEqual({
        cityCode: "54321",
        zpcCode: "2_3",
        zpcDescription: {
          climat: "Climat frais tempéré humide",
          texture: "Moyenne",
        },
      });
    });

    test("it should return the right zpc for a small town", async () => {
      const service = new CarbonStocksPerSoilsCategoryService();
      const result = await service.getTownZpcCode("38375");

      expect(result).toBeDefined();
      expect(result).toEqual({
        cityCode: "38375",
        zpcCode: "2_3",
        zpcDescription: {
          climat: "Climat frais tempéré humide",
          texture: "Moyenne",
        },
      });
    });
  });

  describe("getCarbonStocksPerSoilsCategoryForZpc", () => {
    test("it should return the right object for zpc 1_2", async () => {
      const service = new CarbonStocksPerSoilsCategoryService();
      const result = await service.getCarbonStocksPerSoilsCategoryForZpc("1_2");

      expect(result).toBeDefined();
      expect(result).toEqual({
        cultivation: 36,
        prairie: 49,
        forest: 47,
        wetLand: 125,
        orchard: 46,
        vineyard: 39,
        artificialisedSoils: 24.5,
        artificialImpermeableSoils: 30,
        artificialGrassedSoils: 49,
        artificialBushyAndTreeFilledSoils: 47,
      });
    });

    test("it should return the right object for zpc 2_1", async () => {
      const service = new CarbonStocksPerSoilsCategoryService();
      const result = await service.getCarbonStocksPerSoilsCategoryForZpc("2_1");

      expect(result).toEqual({
        cultivation: 50,
        prairie: 69,
        forest: 60,
        wetLand: 125,
        orchard: 46,
        vineyard: 39,
        artificialisedSoils: 34.5,
        artificialImpermeableSoils: 30,
        artificialGrassedSoils: 69,
        artificialBushyAndTreeFilledSoils: 60,
      });
    });
  });
});
