export type CityStats = {
  name: string;
  propertyValueMedianPricePerSquareMeters: number;
  population: number;
  surfaceAreaSquareMeters: number;
  accuracy: "france" | "city";
};
export interface CityStatsProvider {
  getCityStats(cityCode: string): Promise<CityStats>;
}
