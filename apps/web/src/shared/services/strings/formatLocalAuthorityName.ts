import { startsByVowel } from "./startsByVowel";

import { LocalAutorityStructureType } from "@/shared/domain/stakeholder";

const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatEpciName = (name: string) => {
  if (name.startsWith("CC")) {
    return `La ${name.replace("CC", "Communauté de Communes")}`;
  }
  if (name.startsWith("CA")) {
    return `La ${name.replace("CA", "Communauté d’Agglomération")}`;
  }
  if (name.startsWith("CU")) {
    return `La ${name.replace("CU", "Communauté Urbaine")}`;
  }
  return name;
};

export const formatMunicipalityName = (name: string) => {
  if (startsByVowel(name) || name.toLowerCase().startsWith("h")) {
    return `La mairie d’${capitalize(name)}`;
  }
  return `La mairie de ${capitalize(name)}`;
};

export default (
  type: LocalAutorityStructureType,
  localAuthorities: {
    city: {
      code: string;
      name: string;
    };
    epci?: {
      code: string;
      name: string;
    };
    department: {
      code: string;
      name: string;
    };
    region: {
      code: string;
      name: string;
    };
  },
) => {
  switch (type) {
    case "municipality":
      return formatMunicipalityName(localAuthorities.city.name);
    case "epci":
      return formatEpciName(localAuthorities.epci?.name ?? "");
    case "department":
      return `Le département ${localAuthorities.department.name}`;
    case "region":
      return `La région ${localAuthorities.region.name}`;
  }
};
