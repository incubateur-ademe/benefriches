import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { AxiosError } from "axios";
import { catchError, map } from "rxjs";
import { CityDataProvider } from "src/location-features/core/gateways/CityDataProvider";
import { City } from "src/location-features/core/models/city";

/* 
API documentation:
https://api.insee.fr/catalogue/site/themes/wso2/subthemes/insee/pages/item-info.jag?name=DonneesLocales&version=V0.1&provider=insee

Dataset documentation (BDCOM):
https://api.insee.fr/catalogue/site/themes/wso2/subthemes/insee/templates/api/documentation/download.jag?tenant=carbon.super&resourceUrl=/registry/resource/_system/governance/apimgt/applicationdata/provider/insee/DonneesLocales/V0.1/documentation/files/doc_BDCOM.xlsx
*/
const API_URL = "https://api.insee.fr/donnees-locales/V0.1";

const DATA_CONFIG = {
  dataset: "BDCOM2020",
  mode: "1",
  junction: "INDICS_BDCOM",
  geolevel: "COM",
  superficieCode: "SUPERFICIE",
  populationCode: "PMUN20",
} as const;

interface InseeData {
  Cellule: {
    Zone: { "@codgeo": string; "@nivgeo": typeof DATA_CONFIG.geolevel };
    Mesure: {
      "@code": typeof DATA_CONFIG.populationCode | typeof DATA_CONFIG.superficieCode;
    };
    Modalite: {
      "@code": typeof DATA_CONFIG.mode;
      "@variable": typeof DATA_CONFIG.junction;
    };
    Valeur: string;
  }[];
}

export class LocalDataInseeService implements CityDataProvider {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  getCitySurfaceAreaAndPopulation(cityCode: string) {
    const inseeApiToken = this.configService.getOrThrow<string>("INSEE_API_TOKEN");
    const config = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${inseeApiToken}`,
      },
    };
    return this.httpService
      .get(
        `${API_URL}/donnees/geo-${DATA_CONFIG.junction}@${DATA_CONFIG.dataset}/${DATA_CONFIG.geolevel}-${cityCode}.${DATA_CONFIG.mode}`,
        config,
      )
      .pipe(
        map((res) => {
          const result = res.data as InseeData;
          const superficie = result.Cellule.find(
            (cellule) => cellule.Mesure["@code"] === "SUPERFICIE",
          );
          const population = result.Cellule.find((cellule) => cellule.Mesure["@code"] === "PMUN20");
          if (!population || !superficie) {
            throw new Error(`No data found for cityCode: ${cityCode}`);
          }
          return City.create({
            cityCode,
            area: +superficie.Valeur,
            population: +population.Valeur,
          });
        }),
      )
      .pipe(
        catchError((axiosError: AxiosError) => {
          const err = new Error(
            `Error response from INSEE Données Locales API: ${axiosError.message}`,
          );
          if (axiosError.response?.data) {
            err.message.concat(` - ${axiosError.response.data as string}`);
          }
          throw err;
        }),
      );
  }
}
