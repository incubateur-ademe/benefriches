import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import fs from "fs/promises";
import { CarbonStocksPerSoilsCategoryDataProvider } from "src/location-features/domain/gateways/CarbonStocksPerSoilCategoryDataProvider";
import { TownCarbonStocksPerSoilCategory } from "src/location-features/domain/models/townCarbonStocksPerSoilCategory";

type ZpcCode = TownCarbonStocksPerSoilCategory["zpcCode"];

type CitiesZpc = Record<string, ZpcCode>;
type ZpcDescriptions = Record<
  ZpcCode,
  TownCarbonStocksPerSoilCategory["zpcDescription"]
>;
type ZpcStocks = Record<ZpcCode, TownCarbonStocksPerSoilCategory["stocks"]>;

@Injectable()
export class CarbonStocksPerSoilsCategoryService
  implements CarbonStocksPerSoilsCategoryDataProvider
{
  async getTownZpcCode(cityCode: string) {
    if (!cityCode || cityCode.length === 0) {
      throw new BadRequestException();
    }

    try {
      const citiesZpc = JSON.parse(
        (await fs.readFile("data/citiesZpc.json")).toString(),
      ) as CitiesZpc;

      if (!Object.prototype.hasOwnProperty.call(citiesZpc, cityCode)) {
        throw new NotFoundException();
      }

      const zpcCity = citiesZpc[cityCode];

      const zpcDescriptions = JSON.parse(
        (await fs.readFile("data/zpcDescriptions.json")).toString(),
      ) as ZpcDescriptions;

      const zpcDescription =
        zpcCity in zpcDescriptions ? zpcDescriptions[zpcCity] : undefined;

      return Promise.resolve({
        zpcDescription,
        zpcCode: zpcCity,
        cityCode,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getCarbonStocksPerSoilsCategoryForZpc(zpcCode: ZpcCode) {
    if (zpcCode.length === 0) {
      throw new BadRequestException();
    }

    try {
      const zpcStocks = JSON.parse(
        (await fs.readFile("data/zpcStocks.json")).toString(),
      ) as ZpcStocks;
      const value = zpcStocks[zpcCode];

      return Promise.resolve(value);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
