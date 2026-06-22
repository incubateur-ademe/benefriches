import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createSoilSurfaceAreaDistribution } from "shared";

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

describe("Site core logic", () => {
  describe("createFriche", () => {
    type FricheSuccessResult = Extract<ReturnType<typeof createFriche>, { success: true }>;
    type FricheErrorResult = Extract<ReturnType<typeof createFriche>, { success: false }>;

    const minimalProps: CreateFricheProps = {
      id: "e869d8db-3d63-4fd5-93ab-7728c1c19a1e",
      name: "Unit test friche",
      address: {
        city: "Paris",
        cityCode: "75000",
        postCode: "75000",
        value: "Paris",
        banId: "123456",
        lat: 48.8566,
        long: 2.3522,
      },
      yearlyExpenses: [],
      soilsDistribution: {
        BUILDINGS: 150,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 400,
        MINERAL_SOIL: 250,
      },
    };
    it("cannot create a friche with an invalid friche activity", () => {
      const result = createFriche({
        ...minimalProps,
        // @ts-expect-error wrong friche activity
        fricheActivity: "incorrect",
      }) as FricheErrorResult;
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error.fieldErrors.fricheActivity?.length, 1);
      assert.ok(result.error.fieldErrors.fricheActivity?.[0]?.includes("Invalid option"));
    });

    it("cannot create a friche with empty soils distribution", () => {
      const result = createFriche({
        ...minimalProps,
        soilsDistribution: {},
      });
      assert.strictEqual(result.success, false);
      // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
      const errorResult = result as FricheErrorResult;
      assert.strictEqual(errorResult.error.fieldErrors.soilsDistribution?.length, 1);
      assert.ok(
        errorResult.error.fieldErrors.soilsDistribution?.[0]?.includes(
          "Total surface area must be greater than 0",
        ),
      );
    });

    it("will assign 'OTHER' activity when none provided", () => {
      const result = createFriche(minimalProps) as FricheSuccessResult;
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.site.fricheActivity, "OTHER");
    });

    it("should set surface area from soils distribution", () => {
      const soilsDistribution = {
        BUILDINGS: 1200,
        ARTIFICIAL_TREE_FILLED: 10000,
      };
      const result = createFriche({ ...minimalProps, soilsDistribution }) as FricheSuccessResult;
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.site.surfaceArea, 11200);
    });

    it("should set default owner when none provided", () => {
      const result = createFriche({ ...minimalProps, owner: undefined }) as FricheSuccessResult;
      assert.strictEqual(result.success, true);
      assert.deepStrictEqual(result.site.owner, {
        name: "Propriétaire inconnu",
        structureType: "unknown",
      });
    });

    it("should set hasContaminatedSoils to false when no contaminated soil surface", () => {
      const result = createFriche({
        ...minimalProps,
        contaminatedSoilSurface: undefined,
      }) as FricheSuccessResult;
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.site.hasContaminatedSoils, false);
    });

    it("should set hasContaminatedSoils to true when no contaminated soil surface", () => {
      const result = createFriche({
        ...minimalProps,
        contaminatedSoilSurface: 1200,
      }) as FricheSuccessResult;
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.site.hasContaminatedSoils, true);
    });

    it("cannot create friche with non-uuid id", () => {
      const result = createFriche({ ...minimalProps, id: "not-a-uuid" }) as FricheErrorResult;
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error.fieldErrors.id?.length, 1);
      assert.ok(result.error.fieldErrors.id?.[0]?.includes("Invalid UUID"));
    });

    it("cannot create friche with negative expenses amount", () => {
      const result = createFriche({
        ...minimalProps,
        yearlyExpenses: [{ purpose: "maintenance", bearer: "owner", amount: -1 }],
      }) as FricheErrorResult;
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error.fieldErrors.yearlyExpenses?.length, 1);
      assert.ok(
        result.error.fieldErrors.yearlyExpenses?.[0]?.includes("expected number to be >=0"),
      );
    });

    it("set empty yearly incomes", () => {
      const result = createFriche(minimalProps) as FricheSuccessResult;
      assert.strictEqual(result.success, true);
      assert.deepStrictEqual(result.site.yearlyIncomes, []);
    });

    it("creates friche with complete data", () => {
      const completeFricheData: Required<CreateFricheProps> = {
        name: "My friche",
        description: "Description of the site",
        id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
        owner: {
          structureType: "department",
          name: "Le département Paris",
        },
        soilsDistribution: { ARTIFICIAL_TREE_FILLED: 14000 },
        yearlyExpenses: [{ purpose: "maintenance", bearer: "owner", amount: 150000 }],
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
        fricheActivity: "BUILDING",
        accidentsDeaths: 0,
        accidentsMinorInjuries: 2,
        accidentsSevereInjuries: 1,
        contaminatedSoilSurface: 1200,
        tenant: {
          structureType: "company",
          name: "Tenant SARL",
        },
      };
      const result = createFriche(completeFricheData) as FricheSuccessResult;
      assert.strictEqual(result.success, true);
      assert.deepStrictEqual(result.site satisfies Friche, {
        name: "My friche",
        nature: "FRICHE",
        description: "Description of the site",
        id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
        owner: {
          structureType: "department",
          name: "Le département Paris",
        },
        soilsDistribution: createSoilSurfaceAreaDistribution({ ARTIFICIAL_TREE_FILLED: 14000 }),
        surfaceArea: 14000,
        yearlyIncomes: [],
        yearlyExpenses: [{ purpose: "maintenance", bearer: "owner", amount: 150000 }],
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
        fricheActivity: "BUILDING",
        accidentsDeaths: 0,
        accidentsMinorInjuries: 2,
        accidentsSevereInjuries: 1,
        contaminatedSoilSurface: 1200,
        hasContaminatedSoils: true,
        tenant: {
          structureType: "company",
          name: "Tenant SARL",
        },
      });
    });
  });
  describe("createAgriculturalOrNaturalSite", () => {
    type AgriculturalOperationSuccessResult = Extract<
      ReturnType<typeof createAgriculturalOrNaturalSite>,
      { success: true }
    >;
    type AgriculturalOperationErrorResult = Extract<
      ReturnType<typeof createAgriculturalOrNaturalSite>,
      { success: false }
    >;

    const minimalProps: CreateAgriculturalOrNaturalSiteProps = {
      id: "e869d8db-3d63-4fd5-93ab-7728c1c19a1e",
      name: "Unit test agricultural operation",
      nature: "AGRICULTURAL_OPERATION",
      agriculturalOperationActivity: "CEREALS_AND_OILSEEDS_CULTIVATION",
      isSiteOperated: false,
      address: {
        city: "Paris",
        cityCode: "75000",
        postCode: "75000",
        value: "Paris",
        banId: "123456",
        lat: 48.8566,
        long: 2.3522,
      },
      yearlyExpenses: [],
      yearlyIncomes: [],
      soilsDistribution: {},
    };

    it("should set surface area from soils distribution", () => {
      const soilsDistribution = {
        BUILDINGS: 1200,
        ARTIFICIAL_TREE_FILLED: 10000,
      };
      const result = createAgriculturalOrNaturalSite({
        ...minimalProps,
        soilsDistribution,
      }) as AgriculturalOperationSuccessResult;
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.site.surfaceArea, 11200);
    });

    it("should set default owner when none provided", () => {
      const result = createAgriculturalOrNaturalSite({
        ...minimalProps,
        owner: undefined,
      }) as AgriculturalOperationSuccessResult;
      assert.strictEqual(result.success, true);
      assert.deepStrictEqual(result.site.owner, {
        name: "Propriétaire inconnu",
        structureType: "unknown",
      });
    });

    it("cannot create agricultural operation with non-uuid id", () => {
      const result = createAgriculturalOrNaturalSite({
        ...minimalProps,
        id: "not-a-uuid",
      }) as AgriculturalOperationErrorResult;
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error.fieldErrors.id?.length, 1);
      assert.ok(result.error.fieldErrors.id?.[0]?.includes("Invalid UUID"));
    });

    it("cannot create agricultural operation with negative expenses amount", () => {
      const result = createAgriculturalOrNaturalSite({
        ...minimalProps,
        yearlyExpenses: [{ purpose: "maintenance", bearer: "owner", amount: -1 }],
      }) as AgriculturalOperationErrorResult;
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error.fieldErrors.yearlyExpenses?.length, 1);
      assert.ok(
        result.error.fieldErrors.yearlyExpenses?.[0]?.includes("expected number to be >=0"),
      );
    });

    it("cannot create agricultural operation with negative income amount", () => {
      const result = createAgriculturalOrNaturalSite({
        ...minimalProps,
        yearlyIncomes: [{ source: "other", amount: -1 }],
      }) as AgriculturalOperationErrorResult;
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error.fieldErrors.yearlyIncomes?.length, 1);
      assert.ok(result.error.fieldErrors.yearlyIncomes?.[0]?.includes("expected number to be >=0"));
    });

    it("creates agricultural operation with complete data", () => {
      const completeAgriculturalOperation: Required<CreateAgriculturalOrNaturalSiteProps> = {
        name: "My agricultural operation",
        nature: "AGRICULTURAL_OPERATION",
        agriculturalOperationActivity: "LARGE_VEGETABLE_CULTIVATION",
        isSiteOperated: true,
        description: "Description of the site",
        id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
        owner: {
          structureType: "department",
          name: "Le département Nord",
        },
        soilsDistribution: { PRAIRIE_BUSHES: 14000 },
        yearlyExpenses: [{ purpose: "maintenance", bearer: "owner", amount: 150000 }],
        yearlyIncomes: [{ source: "other", amount: 10000 }],
        address: {
          city: "Hazebrouck",
          cityCode: "59295",
          postCode: "59190",
          banId: "63d91449-1839-4ad2-b5b2-28c2fa898c50",
          lat: 667160.14,
          long: 67160.14,
          value: "Hazebrouck",
        },
        tenant: {
          structureType: "company",
          name: "Tenant SARL",
        },
      };
      const result = createAgriculturalOrNaturalSite(
        completeAgriculturalOperation,
      ) as AgriculturalOperationSuccessResult;
      assert.strictEqual(result.success, true);
      assert.deepStrictEqual(result.site satisfies AgriculturalOrNaturalSite, {
        name: "My agricultural operation",
        nature: "AGRICULTURAL_OPERATION",
        agriculturalOperationActivity: "LARGE_VEGETABLE_CULTIVATION",
        isSiteOperated: true,
        description: "Description of the site",
        id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
        owner: {
          structureType: "department",
          name: "Le département Nord",
        },
        soilsDistribution: createSoilSurfaceAreaDistribution({ PRAIRIE_BUSHES: 14000 }),
        surfaceArea: 14000,
        yearlyIncomes: [{ source: "other", amount: 10000 }],
        yearlyExpenses: [{ purpose: "maintenance", bearer: "owner", amount: 150000 }],
        address: {
          city: "Hazebrouck",
          cityCode: "59295",
          postCode: "59190",
          banId: "63d91449-1839-4ad2-b5b2-28c2fa898c50",
          lat: 667160.14,
          long: 67160.14,
          value: "Hazebrouck",
        },
        tenant: {
          structureType: "company",
          name: "Tenant SARL",
        },
      });
    });
  });

  describe("createUrbanZoneSite", () => {
    type UrbanZoneSuccessResult = Extract<
      ReturnType<typeof createUrbanZoneSite>,
      { success: true }
    >;
    type UrbanZoneErrorResult = Extract<ReturnType<typeof createUrbanZoneSite>, { success: false }>;

    const minimalProps: CreateUrbanZoneSiteProps = {
      id: "e869d8db-3d63-4fd5-93ab-7728c1c19a1e",
      name: "Urban zone test",
      address: {
        city: "Lyon",
        cityCode: "69123",
        postCode: "69001",
        value: "Lyon",
        banId: "abc123",
        lat: 45.764,
        long: 4.8357,
      },
      yearlyExpenses: [],
      yearlyIncomes: [],
      urbanZoneType: "ECONOMIC_ACTIVITY_ZONE",
      manager: { structureType: "activity_park_manager", name: "Gestionnaire ZAE" },
      vacantCommercialPremisesFootprint: 0,
      landParcels: [
        {
          type: "COMMERCIAL_ACTIVITY_AREA",
          surfaceArea: 5000,
          soilsDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 2000 },
        },
        {
          type: "PUBLIC_SPACES",
          surfaceArea: 2000,
          soilsDistribution: { MINERAL_SOIL: 1000, ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1000 },
        },
      ],
    };

    it("creates urban zone site with minimal data", () => {
      const result = createUrbanZoneSite(minimalProps) as UrbanZoneSuccessResult;
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.site.nature, "URBAN_ZONE");
      assert.strictEqual(result.site.urbanZoneType, "ECONOMIC_ACTIVITY_ZONE");
      assert.strictEqual(result.site.landParcels.length, 2);
      assert.deepStrictEqual(
        result.site.soilsDistribution,
        createSoilSurfaceAreaDistribution({
          BUILDINGS: 3000,
          IMPERMEABLE_SOILS: 2000,
          MINERAL_SOIL: 1000,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1000,
        }),
      );
      assert.strictEqual(result.site.surfaceArea, 7000);
    });

    it("cannot create urban zone site with non-uuid id", () => {
      const result = createUrbanZoneSite({
        ...minimalProps,
        id: "not-a-uuid",
      }) as UrbanZoneErrorResult;
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error.fieldErrors.id?.length, 1);
    });

    it("cannot create urban zone site with empty land parcels", () => {
      const result = createUrbanZoneSite({
        ...minimalProps,
        landParcels: [],
      }) as UrbanZoneErrorResult;
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error.fieldErrors.landParcels?.length, 1);
    });

    it("should set default owner when none provided", () => {
      const result = createUrbanZoneSite({
        ...minimalProps,
        owner: undefined,
      }) as UrbanZoneSuccessResult;
      assert.strictEqual(result.success, true);
      assert.deepStrictEqual(result.site.owner, {
        name: "Propriétaire inconnu",
        structureType: "unknown",
      });
    });

    it("creates urban zone site with complete data", () => {
      const completeProps: CreateUrbanZoneSiteProps = {
        ...minimalProps,
        description: "A complete urban zone",
        owner: { structureType: "municipality", name: "Mairie de Lyon" },
        hasContaminatedSoils: true,
        contaminatedSoilSurface: 500,
        manager: { structureType: "company", name: "Manager SARL" },
        vacantCommercialPremisesFootprint: 1000,
        vacantCommercialPremisesFloorArea: 800,
        fullTimeJobsEquivalent: 42.5,
      };
      const result = createUrbanZoneSite(completeProps) as UrbanZoneSuccessResult;
      assert.strictEqual(result.success, true);
      assert.deepStrictEqual(result.site satisfies UrbanZoneSite, {
        id: "e869d8db-3d63-4fd5-93ab-7728c1c19a1e",
        name: "Urban zone test",
        nature: "URBAN_ZONE",
        description: "A complete urban zone",
        address: minimalProps.address,
        soilsDistribution: createSoilSurfaceAreaDistribution({
          BUILDINGS: 3000,
          IMPERMEABLE_SOILS: 2000,
          MINERAL_SOIL: 1000,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1000,
        }),
        surfaceArea: 7000,
        owner: { structureType: "municipality", name: "Mairie de Lyon" },
        yearlyExpenses: [],
        yearlyIncomes: [],
        urbanZoneType: "ECONOMIC_ACTIVITY_ZONE",
        landParcels: [
          {
            type: "COMMERCIAL_ACTIVITY_AREA",
            surfaceArea: 5000,
            soilsDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 2000 },
          },
          {
            type: "PUBLIC_SPACES",
            surfaceArea: 2000,
            soilsDistribution: { MINERAL_SOIL: 1000, ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1000 },
          },
        ],
        hasContaminatedSoils: true,
        contaminatedSoilSurface: 500,
        manager: { structureType: "company", name: "Manager SARL" },
        vacantCommercialPremisesFootprint: 1000,
        vacantCommercialPremisesFloorArea: 800,
        fullTimeJobsEquivalent: 42.5,
      });
    });
  });
});
