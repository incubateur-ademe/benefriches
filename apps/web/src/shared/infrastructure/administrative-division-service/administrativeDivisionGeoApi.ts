type Response = {
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
  population: number;
};

// API Découpage administratif : https://geo.api.gouv.fr/

const GEO_API_HOSTNAME = "https://geo.api.gouv.fr";
const MUNICIPALITY_URL = "/communes";
const FIELDS =
  "fields=nom,code,codeEpci,epci,codeDepartement,departement,codeRegion,region,population,surface";

export class AdministrativeDivisionGeoApi {
  async getMunicipalityData(cityCode: string) {
    const response = await fetch(`${GEO_API_HOSTNAME}${MUNICIPALITY_URL}/${cityCode}?${FIELDS}`);

    if (!response.ok) throw new Error("Error while fetching geo api gouv");

    const jsonResult = (await response.json()) as Response;

    return {
      localAuthorities: {
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
      },
      population: jsonResult.population,
    };
  }
}
