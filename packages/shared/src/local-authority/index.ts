export const LOCAL_AUTHORITIES = ["municipality", "epci", "department", "region"] as const;

export type LocalAuthority = (typeof LOCAL_AUTHORITIES)[number];

export const isLocalAuthority = (structureType: string): structureType is LocalAuthority => {
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return LOCAL_AUTHORITIES.includes(structureType as LocalAuthority);
};

export * from "./formatLocalAuthorityName";
export * from "./formatCityWithPlacePreposition";
