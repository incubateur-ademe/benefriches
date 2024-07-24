import getExpressSiteData from "./siteExpress";

const currentUserId = "0f274b34-84f8-4527-9163-ab77cb467cd1";
const expressFricheDraft = {
  id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
  surfaceArea: 20000,
  isFriche: true,
  address: {
    city: "Paris",
    cityCode: "75109",
    postCode: "75009",
    banId: "123abc",
    lat: 48.876517,
    long: 2.330785,
    value: "1 rue de Londres, 75009 Paris",
    streetName: "rue de Londres",
    municipality: "Paris",
    population: 2133111,
  },
};

const expressSiteDraft = {
  id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
  surfaceArea: 20000,
  isFriche: false,
  address: {
    city: "Blajan",
    cityCode: "31070",
    postCode: "31350",
    banId: "31070",
    lat: 43.260128,
    long: 0.652416,
    value: "Blajan",
    municipality: "Blajan",
    population: 439,
  },
};

describe("Site Express data creation", () => {
  describe("getExpressSiteData", () => {
    it("returns friche express data", () => {
      expect(getExpressSiteData(expressFricheDraft, currentUserId)).toEqual({
        ...expressFricheDraft,
        createdBy: currentUserId,
        soilsDistribution: {
          BUILDINGS: 6000,
          IMPERMEABLE_SOILS: 4000,
          MINERAL_SOIL: 3000,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 5000,
          ARTIFICIAL_TREE_FILLED: 2000,
        },
        contaminatedSoilSurface: 10000,
        owner: {
          structureType: "municipality",
          name: "Mairie de Paris",
        },
        tenant: {
          name: "Actuel locataire",
          structureType: "company",
        },
        yearlyExpenses: [
          {
            amount: 42000,
            purpose: "maintenance",
            bearer: "owner",
            purposeCategory: "site_management",
          },
          {
            amount: 30000,
            purpose: "propertyTaxes",
            bearer: "owner",
            purposeCategory: "taxes",
          },

          {
            amount: 90231,
            purpose: "illegalDumpingCost",
            bearer: "owner",
            purposeCategory: "safety",
          },
          {
            amount: 44000,
            purpose: "security",
            bearer: "owner",
            purposeCategory: "safety",
          },
        ],
        yearlyIncomes: [],
        name: "Friche de Paris",
      });
    });

    it("returns site express data", () => {
      expect(getExpressSiteData(expressSiteDraft, currentUserId)).toEqual({
        ...expressSiteDraft,
        createdBy: currentUserId,
        soilsDistribution: {
          BUILDINGS: 6000,
          IMPERMEABLE_SOILS: 4000,
          MINERAL_SOIL: 3000,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 5000,
          ARTIFICIAL_TREE_FILLED: 2000,
        },
        contaminatedSoilSurface: undefined,
        owner: {
          structureType: "municipality",
          name: "Mairie de Blajan",
        },
        tenant: {
          name: "Actuel locataire",
          structureType: "company",
        },
        yearlyExpenses: [
          {
            amount: 42000,
            purpose: "maintenance",
            bearer: "owner",
            purposeCategory: "site_management",
          },
          {
            amount: 30000,
            purpose: "propertyTaxes",
            bearer: "owner",
            purposeCategory: "taxes",
          },
        ],
        yearlyIncomes: [],
        name: "Espace naturel et agricole de Blajan",
      });
    });
  });
});
