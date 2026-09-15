export type CityImpactsData = {
  name: string;
  mteZonageAbc?: "A" | "B" | "C" | "B1" | "B2" | "Abis";
  isRural: boolean;
  stats: {
    propertyValueMedianPricePerSquareMeters: number;
    population: number;
    surfaceAreaSquareMeters: number;
    accuracy: "france" | "city";
  };
};
export interface CityImpactsDataProvider {
  getCityDataAndStats(cityCode: string): Promise<CityImpactsData>;
}
