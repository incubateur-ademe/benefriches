import { LocalAuthority } from ".";
import { formatCityWithPlacePreposition } from "./formatCityWithPlacePreposition";

export const formatEpciName = (name: string): string => {
  if (name.startsWith("CC")) {
    return name.replace("CC", "Communauté de Communes");
  }
  if (name.startsWith("CA")) {
    return name.replace("CA", "Communauté d'Agglomération");
  }
  if (name.startsWith("CU")) {
    return name.replace("CU", "Communauté Urbaine");
  }
  return name;
};

export const formatMunicipalityName = (name: string): string => {
  return `Mairie ${formatCityWithPlacePreposition(name)}`;
};

export const formatLocalAuthorityName = (
  type: LocalAuthority,
  localAuthorityName: string,
): string => {
  switch (type) {
    case "municipality":
      return formatMunicipalityName(localAuthorityName);
    case "epci":
      return formatEpciName(localAuthorityName);
    case "department":
      return `Département ${localAuthorityName}`;
    case "region":
      return `Région ${localAuthorityName}`;
  }
};
