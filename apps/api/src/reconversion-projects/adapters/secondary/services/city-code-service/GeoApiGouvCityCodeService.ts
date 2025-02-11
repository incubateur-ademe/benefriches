import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosError } from "axios";
import { catchError, lastValueFrom, map } from "rxjs";

import { CityCodeService } from "src/reconversion-projects/core/gateways/CityCodeService";
import { City } from "src/reconversion-projects/core/usecases/quickComputeUrbanProjectImpactsOnFricheUseCase.usecase";

type Response = {
  nom: string;
  population: number;
  surface: number;
};

// API Découpage administratif : https://geo.api.gouv.fr/

const GEO_API_HOSTNAME = "https://geo.api.gouv.fr";
const MUNICIPALITY_URL = "/communes";
const FIELDS = "fields=nom,population,surface";

@Injectable()
export class GeoApiGouvCityCodeService implements CityCodeService {
  constructor(private readonly httpService: HttpService) {}

  async getCityByCityCode(cityCode: string): Promise<City> {
    const observable = this.httpService
      .get(`${GEO_API_HOSTNAME}${MUNICIPALITY_URL}/${cityCode}?${FIELDS}`)
      .pipe(
        map((res) => {
          const result = res.data as Response;
          const surfaceAreaInHectares = result.surface;
          const population = result.population;
          if (!population || !surfaceAreaInHectares) {
            throw new Error(`No data found for cityCode: ${cityCode}`);
          }

          return {
            name: result.nom,
            cityCode,
            population,
            surfaceArea: surfaceAreaInHectares * 10000,
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
