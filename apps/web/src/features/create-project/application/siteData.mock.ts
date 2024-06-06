import { ProjectSite } from "../domain/project.types";

export const relatedSiteData = {
  id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
  name: "My site name",
  isFriche: true,
  owner: { structureType: "company", name: "SAS Owner" },
  soilsDistribution: {
    ["BUILDINGS"]: 3000,
    ["MINERAL_SOIL"]: 5000,
    ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED"]: 10000,
    ["FOREST_DECIDUOUS"]: 12000,
  },
  surfaceArea: 30000,
  hasContaminatedSoils: false,
  address: {
    banId: "31070_p4ur8e",
    value: "Sendere 31350 Blajan",
    city: "Blajan",
    cityCode: "31070",
    postCode: "31350",
    streetName: "Sendere",
    long: 0.664699,
    lat: 43.260859,
  },
} as const satisfies ProjectSite;
