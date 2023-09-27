import { TownCarbonStocksPerSoilCategory } from "../models/townCarbonStocksPerSoilCategory";

interface ZpcCity {
  cityCode: TownCarbonStocksPerSoilCategory["cityCode"];
  zpcCode: TownCarbonStocksPerSoilCategory["zpcCode"];
  zpcDescription?: TownCarbonStocksPerSoilCategory["zpcDescription"];
}

export interface CarbonStocksPerSoilsCategoryDataProvider {
  getTownZpcCode(cityCode: string): Promise<ZpcCity>;
  getCarbonStocksPerSoilsCategoryForZpc(
    zpcCode: TownCarbonStocksPerSoilCategory["zpcCode"],
  ): Promise<TownCarbonStocksPerSoilCategory["stocks"]>;
}
