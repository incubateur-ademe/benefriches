export interface CityRuralityQuery {
  isCityRural(cityCode: string): Promise<boolean>;
}
