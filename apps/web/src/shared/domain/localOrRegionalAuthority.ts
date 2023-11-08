export type LocalAndRegionalAuthority =
  | "municipality"
  | "community_of_municipalities"
  | "department"
  | "region"
  | "state";

export const getLabelForLocalOrRegionalAuthority = (
  localOrRegionalAuthority: LocalAndRegionalAuthority,
): string => {
  switch (localOrRegionalAuthority) {
    case "municipality":
      return "Commune";
    case "community_of_municipalities":
      return "Intercommunalité";
    case "department":
      return "Département";
    case "region":
      return "Région";
    case "state":
      return "L'État";
  }
};
