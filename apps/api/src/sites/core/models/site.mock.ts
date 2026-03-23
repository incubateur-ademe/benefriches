import {
  AgriculturalOrNaturalSite,
  createAgriculturalOrNaturalSite,
  CreateAgriculturalOrNaturalSiteProps,
  createFriche,
  CreateFricheProps,
  createUrbanZoneSite,
  CreateUrbanZoneSiteProps,
  Friche,
  UrbanZoneSite,
} from "./site";

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
    soilsDistribution: {
      ARTIFICIAL_TREE_FILLED: 5000,
      FOREST_MIXED: 60000,
      MINERAL_SOIL: 5000,
    },
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
    soilsDistribution: {
      ARTIFICIAL_TREE_FILLED: 5000,
      FOREST_MIXED: 60000,
      MINERAL_SOIL: 5000,
    },
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

export const buildUrbanZoneSiteProps = (
  propsOverride?: Partial<CreateUrbanZoneSiteProps>,
): CreateUrbanZoneSiteProps => {
  return {
    id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    name: "Zone d'activités test",
    yearlyExpenses: [],
    yearlyIncomes: [],
    owner: {
      structureType: "municipality",
      name: "Mairie de Lyon",
    },
    address: {
      city: "Lyon",
      cityCode: "69123",
      postCode: "69001",
      banId: "69123_abc",
      lat: 45.764,
      long: 4.8357,
      value: "1 rue de la République, 69001 Lyon",
      streetName: "rue de la République",
    },
    urbanZoneType: "ECONOMIC_ACTIVITY_ZONE",
    manager: { structureType: "activity_park_manager", name: "Gestionnaire ZAE" },
    vacantCommercialPremisesFootprint: 1000,
    landParcels: [
      {
        type: "COMMERCIAL_ACTIVITY_AREA",
        surfaceArea: 5000,
        soilsDistribution: { BUILDINGS: 3000, MINERAL_SOIL: 1500, IMPERMEABLE_SOILS: 2000 },
      },
      {
        type: "PUBLIC_SPACES",
        surfaceArea: 2000,
        soilsDistribution: { MINERAL_SOIL: 1000, ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1000 },
      },
    ],
    ...propsOverride,
  };
};

export const buildUrbanZoneSite = (
  propsOverride?: Partial<CreateUrbanZoneSiteProps>,
): UrbanZoneSite => {
  const result = createUrbanZoneSite(buildUrbanZoneSiteProps(propsOverride));
  if (!result.success) {
    throw new Error("Failed to create urban zone site in mock");
  }
  return result.site;
};
