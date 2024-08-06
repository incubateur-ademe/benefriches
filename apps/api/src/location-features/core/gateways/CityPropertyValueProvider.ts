import { Observable } from "rxjs";

export interface CityPropertyValueProvider {
  getCityHousingPropertyValue(
    cityCode: string,
  ): Observable<{ medianPricePerSquareMeters: number; referenceYear: string }>;
}
