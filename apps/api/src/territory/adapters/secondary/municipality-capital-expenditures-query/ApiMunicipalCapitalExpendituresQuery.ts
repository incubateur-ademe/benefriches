import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosError } from "axios";
import { catchError, lastValueFrom, map } from "rxjs";

import { MunicipalityCapitalExpendituresProvider } from "src/territory/core/gateways/MunicipalityCapitalExpendituresProvider";

// observatoire des finances et de la gestion publique locales
const OFGL_URL = `https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/ofgl-base-communes-consolidee/records`;

interface ApiResult {
  total_count: 1;
  results: [
    {
      montant: number;
      annee_join: string;
    },
  ];
}

@Injectable()
export class OFGLApi implements MunicipalityCapitalExpendituresProvider {
  private readonly httpService: HttpService;
  constructor(httpService: HttpService) {
    this.httpService = httpService;
  }

  getLastReferenceYear(cityCode: string) {
    return lastValueFrom(
      this.httpService
        .get<ApiResult>(OFGL_URL, {
          timeout: 10_000,
          params: {
            select: "montant,annee_join",
            where: `com_code="${cityCode}"`,
            refine: `agregat:"Dépenses d'équipement"`,
            order_by: "annee_join desc",
            limit: 1,
          },
        })
        .pipe(
          map(({ data }: { data: ApiResult }) => ({
            referenceYear: data.results[0].annee_join,
            amount: data.results[0].montant,
          })),
        )
        .pipe(
          catchError((axiosError: AxiosError) => {
            const err = new Error(
              `Error response from OFGL API: ${axiosError.message} for cityCode ${cityCode}`,
            );
            if (axiosError.response?.data) {
              err.message.concat(` - ${axiosError.response.data as string}`);
            }
            throw err;
          }),
        ),
    );
  }
}
