import { HttpService } from "@nestjs/axios";
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
            throw new NotFoundException(`No data found for cityCode: ${cityCode}`);
          }
          return City.create({
            cityCode,
            area: +superficie,
            population: +population,
          });
        }),
      )
      .pipe(
        catchError((error: AxiosError) => {
          if (!error.response) {
            throw new HttpException("Something went wrong while setting up the request", 500);
          }
          switch (error.response.status) {
            case 400:
              throw new BadRequestException(error.response.data);
            case 403:
              throw new ForbiddenException(error.response.data);
            case 404:
              throw new NotFoundException(error.response.data);
            default:
              throw new HttpException(error.response.data as string, error.response.status);
          }
        }),
      );
  }
}
