export type LocalAutorityStructureType = "municipality" | "region" | "department" | "epci";
export type OwnerStructureType = LocalAutorityStructureType | "company" | "private_individual";
export type SiteOperatorStructureType =
  | LocalAutorityStructureType
  | "company"
  | "private_individual"
  | "unknown";
