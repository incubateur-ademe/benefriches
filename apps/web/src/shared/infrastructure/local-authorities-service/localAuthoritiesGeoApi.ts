import { LocalAuthoritiesGateway as ProjectLocalAuthoritiesGateway } from "@/features/create-project/application/projectSiteLocalAuthorities.actions";
import { LocalAuthoritiesGateway as SiteLocalAuthoritiesGateway } from "@/features/create-site/application/siteLocalAuthorities.actions";

type LocalAuthoritiesResponse = {
  nom: string;
  epci?: {
    code: string;
    nom: string;
  };
  departement: {
    code: string;
    nom: string;
  };
  region: {
    code: string;
    nom: string;
  };
};

// API Découpage administratif : https://geo.api.gouv.fr/

const TERRITORIAL_DIVISIONS_API_URL = "https://geo.api.gouv.fr/communes";

const LOCAL_AUTHORITIES_FIELDS =
  "fields=nom,code,codeEpci,epci,codeDepartement,departement,codeRegion,region";

export class LocalAuthoritiesGeoApi
  implements SiteLocalAuthoritiesGateway, ProjectLocalAuthoritiesGateway
{
  async getLocalAuthoritiesForCityCode(cityCode: string) {
    const response = await fetch(
      `${TERRITORIAL_DIVISIONS_API_URL}/${cityCode}?${LOCAL_AUTHORITIES_FIELDS}`,
    );

    if (!response.ok) throw new Error("Error while fetching geo api gouv");

    const jsonResult = (await response.json()) as LocalAuthoritiesResponse;
    return {
      city: {
        code: cityCode,
        name: jsonResult.nom,
      },
      epci: jsonResult.epci
        ? {
            name: jsonResult.epci.nom,
            code: jsonResult.epci.code,
          }
        : undefined,
      department: {
        name: jsonResult.departement.nom,
        code: jsonResult.departement.code,
      },
      region: {
        name: jsonResult.region.nom,
        code: jsonResult.region.code,
      },
    };
  }
}
