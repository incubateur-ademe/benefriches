import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosError } from "axios";
import { catchError, map } from "rxjs";

import { CityDataProvider } from "src/location-features/core/gateways/CityDataProvider";
import { City } from "src/location-features/core/models/city";

type Response = {
  population: number;
  surface: number;
};

// API Découpage administratif : https://geo.api.gouv.fr/

const GEO_API_HOSTNAME = "https://geo.api.gouv.fr";
const MUNICIPALITY_URL = "/communes";
const FIELDS = "fields=population,surface";

@Injectable()
export class GeoApiGouvService implements CityDataProvider {
  constructor(private readonly httpService: HttpService) {}

  getCitySurfaceAreaAndPopulation(cityCode: string) {
    return this.httpService
      .get(`${GEO_API_HOSTNAME}${MUNICIPALITY_URL}/${cityCode}?${FIELDS}`)
      .pipe(
        map((res) => {
          const result = res.data as Response;
          const superficie = result.surface;
          const population = result.population;
          if (!population || !superficie) {
            throw new Error(`No data found for cityCode: ${cityCode}`);
          }
          return City.create({
            cityCode,
            area: +superficie,
            population: +population,
          });
        }),
      )
      .pipe(
        catchError((axiosError: AxiosError) => {
          const err = new Error(`Error response from GeoApiGouv API: ${axiosError.message}`);
          if (axiosError.response?.data) {
            err.message.concat(` - ${axiosError.response.data as string}`);
          }
          throw err;
        }),
      );
  }
}
