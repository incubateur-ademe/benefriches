import { FricheSiteProps, NonFricheSiteProps } from "../usecases/createNewSite.usecase";
import { NonFricheSite } from "./site";

export const buildMinimalSiteProps = (
  propsOverride?: Partial<NonFricheSiteProps>,
): NonFricheSiteProps => {
  return {
    id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
    name: "My site",
    isFriche: false,
    surfaceArea: 15000,
    owner: {
      structureType: "department",
      name: "Le département Paris",
    },
    soilsDistribution: {
      BUILDINGS: 3000,
      ARTIFICIAL_TREE_FILLED: 5000,
      FOREST_MIXED: 60000,
      MINERAL_SOIL: 5000,
      IMPERMEABLE_SOILS: 1300,
    },
    yearlyExpenses: [],
    yearlyIncomes: [],
    address: {
      city: "Paris",
      cityCode: "75109",
      postCode: "75009",
      banId: "123abc",
      lat: 48.876517,
      long: 2.330785,
      value: "1 rue de Londres, 75009 Paris",
      streetName: "rue de Londres",
    },
    ...propsOverride,
  };
};

export const buildMinimalSite = (propsOverride?: Partial<NonFricheSite>): NonFricheSite => {
  return {
    ...buildMinimalSiteProps(),
    createdAt: new Date(),
    ...propsOverride,
  };
};

export const buildFricheProps = (propsOverride?: Partial<FricheSiteProps>): FricheSiteProps => {
  return {
    ...buildMinimalSiteProps(),
    isFriche: true,
    fricheActivity: "INDUSTRY",
    ...propsOverride,
  };
};
