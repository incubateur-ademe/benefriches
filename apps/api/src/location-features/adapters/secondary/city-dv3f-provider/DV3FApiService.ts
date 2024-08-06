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
import { CityPropertyValueProvider } from "src/location-features/core/gateways/CityPropertyValueProvider";

// API Données foncières : https://api.gouv.fr/documentation/api-donnees-foncieres
// Documentation des noms de paramètres : https://doc-datafoncier.cerema.fr/doc/guide/dv3f/volume-et-prix
type Response = {
  results: {
    annee: string;
    echelle: string;
    code: string;
    libelle: string;
    nbtrans_cod111: number;
    pxm2_median_cod111: number | null; // cod111 : Maison
    nbtrans_cod121: number;
    pxm2_median_cod121: number | null; // cod111 : Appartement
  }[];
};

const API_HOSTNAME = "https://apidf-preprod.cerema.fr";
const ENDPOINT = "/indicateurs/dv3f/prix/triennal/";
const FIELDS = "fields=pxm2_median_cod111,pxm2_median_cod121,annee";

@Injectable()
export class DV3FApiGouvService implements CityPropertyValueProvider {
  constructor(private readonly httpService: HttpService) {}

  getCityHousingPropertyValue(cityCode: string) {
    return this.httpService
      .get(`${API_HOSTNAME}${ENDPOINT}?code=${cityCode}&echelle=communes&ordering=annee&${FIELDS}`)
      .pipe(
        map((res) => {
          const { results } = res.data as Response;
          if (results.length === 0) {
            throw new NotFoundException(`No data found for cityCode: ${cityCode}`);
          }

          const lastData = results
            .reverse()
            .find(
              ({ pxm2_median_cod121, pxm2_median_cod111 }) =>
                pxm2_median_cod111 !== null || pxm2_median_cod121 !== null,
            );

          if (!lastData) {
            throw new NotFoundException(`No data found for cityCode: ${cityCode}`);
          }

          const {
            annee: referenceYear,
            pxm2_median_cod121: apartmentMedianPricePerSquareMeters,
            pxm2_median_cod111: houseMedianPricePerSquareMeters,
            nbtrans_cod111: houseTransactionNumber,
            nbtrans_cod121: apartmentTransactionNumber,
          } = lastData;

          let medianPricePerSquareMeters = 0;

          if (apartmentMedianPricePerSquareMeters && houseMedianPricePerSquareMeters) {
            medianPricePerSquareMeters =
              (apartmentMedianPricePerSquareMeters * apartmentTransactionNumber +
                houseMedianPricePerSquareMeters * houseTransactionNumber) /
              (houseTransactionNumber + apartmentTransactionNumber);
          } else if (houseMedianPricePerSquareMeters) {
            medianPricePerSquareMeters = houseMedianPricePerSquareMeters;
          } else if (apartmentMedianPricePerSquareMeters) {
            medianPricePerSquareMeters = apartmentMedianPricePerSquareMeters;
          }

          if (medianPricePerSquareMeters === 0) {
            throw new NotFoundException(`No data found for cityCode: ${cityCode}`);
          }

          return {
            medianPricePerSquareMeters: medianPricePerSquareMeters,
            referenceYear,
          };
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
