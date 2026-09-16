export type CityImpactsData = {
  name: string;
  mteZonageAbc?: "A" | "B" | "C" | "B1" | "B2" | "Abis";
  isRural: boolean;
  stats: {
    shareOfWorkTripsByPublicTransport: number | undefined;
    annualRateOfPopulationChange: number | undefined;
    landWithoutBuildingsMedianPricePerSquareMeters: number | undefined;
    propertyValueMedianPricePerSquareMeters: number;
    population: number;
    surfaceAreaSquareMeters: number;
    accuracy: "france" | "city";
  };
};
export interface CityImpactsDataProvider {
  getCityDataAndStats(cityCode: string): Promise<CityImpactsData>;
}
