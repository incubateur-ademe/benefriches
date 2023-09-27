// ZPC = zone pédo climatique
// https://docs.datagir.ademe.fr/documentation-aldo/stocks/methode-generale

type ZpcCode =
  | "1_1"
  | "1_2"
  | "1_3"
  | "2_1"
  | "2_2"
  | "2_3"
  | "3_1"
  | "3_2"
  | "3_3"
  | "4_1"
  | "4_2"
  | "4_3"
  | "5_1"
  | "5_3";

type TownCarbonStocksPerSoilCategoryProps = {
  zpcCode: ZpcCode;
  stocksUnit: "tC/ha";
  zpcDescription?: {
    texture: string;
    climat: string;
  };
  stocks: {
    cultivation: number;
    prairie: number;
    forest: number;
    wetLand: number;
    orchard: number;
    vineyard: number;
    artificialisedSoils: number;
    artificialImpermeableSoils: number;
    artificialGrassedSoils: number;
    artificialBushyAndTreeFilledSoils: number;
  };
  cityCode: string;
};

export class TownCarbonStocksPerSoilCategory {
  private constructor(
    readonly cityCode: TownCarbonStocksPerSoilCategoryProps["cityCode"],
    readonly zpcCode: TownCarbonStocksPerSoilCategoryProps["zpcCode"],
    readonly stocks: TownCarbonStocksPerSoilCategoryProps["stocks"],
    readonly stocksUnit: TownCarbonStocksPerSoilCategoryProps["stocksUnit"],
    readonly zpcDescription: TownCarbonStocksPerSoilCategoryProps["zpcDescription"],
  ) {}

  static create({
    zpcCode,
    zpcDescription,
    stocksUnit,
    stocks,
    cityCode,
  }: TownCarbonStocksPerSoilCategoryProps): TownCarbonStocksPerSoilCategory {
    return new TownCarbonStocksPerSoilCategory(
      cityCode,
      zpcCode,
      stocks,
      stocksUnit,
      zpcDescription,
    );
  }
}
