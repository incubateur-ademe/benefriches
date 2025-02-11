import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosError } from "axios";
import { catchError, lastValueFrom, map } from "rxjs";
import { convertHectaresToSquareMeters } from "shared";

import { CityDataProvider } from "src/reconversion-projects/core/gateways/CityDataProvider";
import { City } from "src/reconversion-projects/core/usecases/quickComputeUrbanProjectImpactsOnFricheUseCase.usecase";

type Response = {
  nom: string;
  population: number;
  surface: number; // surface area is returned in hectares by Geo API
};

// API Découpage administratif : https://geo.api.gouv.fr/

const GEO_API_HOSTNAME = "https://geo.api.gouv.fr";
const MUNICIPALITY_PATH = "/communes";
const FIELDS = "fields=nom,population,surface";

@Injectable()
export class GeoApiGouvService implements CityDataProvider {
  constructor(private readonly httpService: HttpService) {}

  async getCitySurfaceAreaAndPopulation(cityCode: string): Promise<City> {
    const observable = this.httpService
      .get(`${GEO_API_HOSTNAME}${MUNICIPALITY_PATH}/${cityCode}?${FIELDS}`)
      .pipe(
        map((res) => {
          const result = res.data as Response;
          const surfaceAreaInHectares = result.surface;
          const population = result.population;
          if (!population || !surfaceAreaInHectares) {
            throw new Error(`No data found for city with city code: ${cityCode}`);
          }

          return {
            name: result.nom,
            cityCode,
            surfaceArea: convertHectaresToSquareMeters(surfaceAreaInHectares),
            population,
          };
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
    const city = await lastValueFrom(observable);
    return city;
  }
}
