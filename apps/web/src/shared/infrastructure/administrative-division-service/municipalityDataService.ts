import { GetCityRuralityResponseDto, LocalAuthority } from "shared";

import type { AdministrativeDivisionGateway } from "@/shared/core/gateways/AdministrativeDivisionGateway";

type Response = {
  nom: string;
  code: string;
  codesPostaux: string[];
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
  "fields=nom,code,codesPostaux,codeEpci,epci,codeDepartement,departement,codeRegion,region,population,surface";

type SearchMunicipalityResult = {
  code: string;
  name: string;
  localAuthorities: {
    type: LocalAuthority;
    name: string;
    code: string;
  }[];
};

async function fetchMunicipalityGeoData(cityCode: string): Promise<Response> {
  const response = await fetch(`${GEO_API_HOSTNAME}${MUNICIPALITY_URL}/${cityCode}?${FIELDS}`);
  if (!response.ok) throw new Error("Error while fetching geo api gouv");
  return response.json() as Promise<Response>;
}

async function fetchCityRurality(cityCode: string): Promise<boolean | undefined> {
  try {
    const response = await fetch(`/api/territory/city-rurality?cityCode=${cityCode}`);
    if (!response.ok) return undefined;
    const json = (await response.json()) as GetCityRuralityResponseDto;
    return json.isRural;
  } catch {
    return undefined;
  }
}

export class MunicipalityDataService implements AdministrativeDivisionGateway {
  async getMunicipalityData(cityCode: string) {
    const [jsonResult, isRural] = await Promise.all([
      fetchMunicipalityGeoData(cityCode),
      fetchCityRurality(cityCode),
    ]);

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
      isRural,
    };
  }

  async searchMunicipality(text: string): Promise<SearchMunicipalityResult[]> {
    const regexPostalCode = /^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/;

    const searchParams = text.match(regexPostalCode) ? `codePostal=${text}` : `nom=${text}`;

    const response = await fetch(
      `${GEO_API_HOSTNAME}${MUNICIPALITY_URL}/?${searchParams}&${FIELDS}`,
    );

    if (!response.ok) throw new Error("Error while fetching geo api gouv");

    const jsonResult = (await response.json()) as Response[];

    return jsonResult.map(({ code, codesPostaux, nom, epci, departement, region }) => ({
      code,
      name: `${nom} (${codesPostaux.length === 1 ? codesPostaux[0] : departement.nom})`,
      localAuthorities: [
        {
          type: "municipality",
          name: nom,
          code,
        },
        {
          type: "epci",
          name: epci?.nom ?? "Établissement public de coopération intercommunale",
          code: epci?.code ?? "",
        },
        {
          type: "department",
          name: departement.nom,
          code: departement.code,
        },
        {
          type: "region",
          name: region.nom,
          code: region.code,
        },
      ],
    }));
  }
}
