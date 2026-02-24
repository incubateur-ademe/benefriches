export type CityStats = {
  name: string;
  residentialPropertyMedianPricePerSquareMeters: number;
  landValueMedianPricePerSquareMeters: number | null;
  population: number;
  surfaceAreaSquareMeters: number;
};
export interface CityStatsProvider {
  getCityStats(cityCode: string): Promise<CityStats>;
}
