import { startsByVowel } from "./startsByVowel";

import { LocalAutorityStructureType } from "@/shared/domain/stakeholder";

const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatEpciName = (name: string) => {
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

export const formatMunicipalityName = (name: string) => {
  if (startsByVowel(name) || name.toLowerCase().startsWith("h")) {
    return `Mairie d'${capitalize(name)}`;
  }
  return `Mairie de ${capitalize(name)}`;
};

export default (type: LocalAutorityStructureType, localAuthorityName: string) => {
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
