import {
  AgriculturalOrNaturalSite,
  createAgriculturalOrNaturalSite,
  CreateAgriculturalOrNaturalSiteProps,
  createFriche,
  CreateFricheProps,
  createSoilSurfaceAreaDistribution,
  Friche,
} from "shared";

export const buildAgriculturalOperationSiteProps = (
  propsOverride?: Partial<CreateAgriculturalOrNaturalSiteProps>,
): CreateAgriculturalOrNaturalSiteProps => {
  return {
    id: "e869d8db-3d63-4fd5-93ab-7728c1c19a1e",
    name: "Unit test friche",
    yearlyExpenses: [],
    yearlyIncomes: [],
    owner: {
      structureType: "department",
      name: "Le département Paris",
    },
    soilsDistribution: createSoilSurfaceAreaDistribution({
      ARTIFICIAL_TREE_FILLED: 5000,
      FOREST_MIXED: 60000,
      MINERAL_SOIL: 5000,
    }),
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
    isSiteOperated: false,
    ...propsOverride,
    nature: "AGRICULTURAL_OPERATION",
    agriculturalOperationActivity: "FLOWERS_AND_HORTICULTURE",
  };
};

export const buildFricheProps = (propsOverride?: Partial<CreateFricheProps>): CreateFricheProps => {
  return {
    id: "e869d8db-3d63-4fd5-93ab-7728c1c19a1e",
    name: "Unit test friche",
    yearlyExpenses: [],
    // createdBy: "841aaa8c-39c1-4953-8459-1f6fab6dd948",
    owner: {
      structureType: "department",
      name: "Le département Paris",
    },
    soilsDistribution: createSoilSurfaceAreaDistribution({
      ARTIFICIAL_TREE_FILLED: 5000,
      FOREST_MIXED: 60000,
      MINERAL_SOIL: 5000,
    }),
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
    ...propsOverride,
  };
};

export const buildFriche = (propsOverride?: Partial<CreateFricheProps>): Friche => {
  const result = createFriche(buildFricheProps(propsOverride));
  if (!result.success) {
    throw new Error("Failed to create friche in mock");
  }
  return result.site;
};

export const buildAgriculturalOrNaturalSite = (
  propsOverride?: Partial<CreateAgriculturalOrNaturalSiteProps>,
): AgriculturalOrNaturalSite => {
  const result = createAgriculturalOrNaturalSite(
    buildAgriculturalOperationSiteProps(propsOverride),
  );
  if (!result.success) {
    throw new Error("Failed to create agricultural/natural site in mock");
  }
  return result.site;
};
