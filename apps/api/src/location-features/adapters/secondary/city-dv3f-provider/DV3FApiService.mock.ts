import { NotFoundException } from "@nestjs/common";
import { Observable } from "rxjs";
import { CityPropertyValueProvider } from "src/location-features/core/gateways/CityPropertyValueProvider";

export class MockDV3FApiService implements CityPropertyValueProvider {
  getCityHousingPropertyValue(
    cityCode: string,
  ): Observable<{ medianPricePerSquareMeters: number; referenceYear: string }> {
    return new Observable((subscriber) => {
      if (cityCode === "wrong") {
        throw new NotFoundException();
      }

      subscriber.next({
        medianPricePerSquareMeters: 2500,
        referenceYear: "2022",
      });
      subscriber.complete();
    });
  }
}
