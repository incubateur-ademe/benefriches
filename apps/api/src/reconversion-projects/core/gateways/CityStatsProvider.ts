export type CityStats = {
  name: string;
  propertyValueMedianPricePerSquareMeters: number;
  population: number;
  surfaceAreaSquareMeters: number;
};
export interface CityStatsProvider {
  getCityStats(cityCode: string): Promise<CityStats>;
}
