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
      expect(result.success).toBe(false);
      expect(result.error.fieldErrors.fricheActivity).toHaveLength(1);
      expect(result.error.fieldErrors.fricheActivity?.[0]).toContain("Invalid option");
    });

    it("cannot create a friche with empty soils distribution", () => {
      const result = createFriche({
        ...minimalProps,
        soilsDistribution: {},
      });
      expect(result.success).toBe(false);
      const errorResult = result as FricheErrorResult;
      expect(errorResult.error.fieldErrors.soilsDistribution).toHaveLength(1);
      expect(errorResult.error.fieldErrors.soilsDistribution?.[0]).toContain(
        "Total surface area must be greater than 0",
      );
    });

    it("will assign 'OTHER' activity when none provided", () => {
      const result = createFriche(minimalProps) as FricheSuccessResult;
      expect(result.success).toBe(true);
      expect(result.site.fricheActivity).toBe("OTHER");
    });

    it("should set surface area from soils distribution", () => {
      const soilsDistribution = {
        BUILDINGS: 1200,
        ARTIFICIAL_TREE_FILLED: 10000,
      };
      const result = createFriche({ ...minimalProps, soilsDistribution }) as FricheSuccessResult;
      expect(result.success).toBe(true);
      expect(result.site.surfaceArea).toBe(11200);
    });

    it("should set default owner when none provided", () => {
      const result = createFriche({ ...minimalProps, owner: undefined }) as FricheSuccessResult;
      expect(result.success).toBe(true);
      expect(result.site.owner).toEqual({ name: "Propriétaire inconnu", structureType: "unknown" });
    });

    it("should set hasContaminatedSoils to false when no contaminated soil surface", () => {
      const result = createFriche({
        ...minimalProps,
        contaminatedSoilSurface: undefined,
      }) as FricheSuccessResult;
      expect(result.success).toBe(true);
      expect(result.site.hasContaminatedSoils).toBe(false);
    });

    it("should set hasContaminatedSoils to true when no contaminated soil surface", () => {
      const result = createFriche({
        ...minimalProps,
        contaminatedSoilSurface: 1200,
      }) as FricheSuccessResult;
      expect(result.success).toBe(true);
      expect(result.site.hasContaminatedSoils).toBe(true);
    });

    it("cannot create friche with non-uuid id", () => {
      const result = createFriche({ ...minimalProps, id: "not-a-uuid" }) as FricheErrorResult;
      expect(result.success).toBe(false);
      expect(result.error.fieldErrors.id).toHaveLength(1);
      expect(result.error.fieldErrors.id?.[0]).toContain("Invalid UUID");
    });

    it("cannot create friche with negative expenses amount", () => {
      const result = createFriche({
        ...minimalProps,
        yearlyExpenses: [{ purpose: "maintenance", bearer: "owner", amount: -1 }],
      }) as FricheErrorResult;
      expect(result.success).toBe(false);
      expect(result.error.fieldErrors.yearlyExpenses).toHaveLength(1);
      expect(result.error.fieldErrors.yearlyExpenses?.[0]).toContain("expected number to be >=0");
    });

    it("set empty yearly incomes", () => {
      const result = createFriche(minimalProps) as FricheSuccessResult;
      expect(result.success).toBe(true);
      expect(result.site.yearlyIncomes).toEqual([]);
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
      expect(result.success).toBe(true);
      expect(result.site).toEqual<Friche>({
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
      expect(result.success).toBe(true);
      expect(result.site.surfaceArea).toBe(11200);
    });

    it("should set default owner when none provided", () => {
      const result = createAgriculturalOrNaturalSite({
        ...minimalProps,
        owner: undefined,
      }) as AgriculturalOperationSuccessResult;
      expect(result.success).toBe(true);
      expect(result.site.owner).toEqual({ name: "Propriétaire inconnu", structureType: "unknown" });
    });

    it("cannot create agricultural operation with non-uuid id", () => {
      const result = createAgriculturalOrNaturalSite({
        ...minimalProps,
        id: "not-a-uuid",
      }) as AgriculturalOperationErrorResult;
      expect(result.success).toBe(false);
      expect(result.error.fieldErrors.id).toHaveLength(1);
      expect(result.error.fieldErrors.id?.[0]).toContain("Invalid UUID");
    });

    it("cannot create agricultural operation with negative expenses amount", () => {
      const result = createAgriculturalOrNaturalSite({
        ...minimalProps,
        yearlyExpenses: [{ purpose: "maintenance", bearer: "owner", amount: -1 }],
      }) as AgriculturalOperationErrorResult;
      expect(result.success).toBe(false);
      expect(result.error.fieldErrors.yearlyExpenses).toHaveLength(1);
      expect(result.error.fieldErrors.yearlyExpenses?.[0]).toContain("expected number to be >=0");
    });

    it("cannot create agricultural operation with negative income amount", () => {
      const result = createAgriculturalOrNaturalSite({
        ...minimalProps,
        yearlyIncomes: [{ source: "other", amount: -1 }],
      }) as AgriculturalOperationErrorResult;
      expect(result.success).toBe(false);
      expect(result.error.fieldErrors.yearlyIncomes).toHaveLength(1);
      expect(result.error.fieldErrors.yearlyIncomes?.[0]).toContain("expected number to be >=0");
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
      expect(result.success).toBe(true);
      expect(result.site).toEqual<AgriculturalOrNaturalSite>({
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
      expect(result.success).toBe(true);
      expect(result.site.nature).toBe("URBAN_ZONE");
      expect(result.site.urbanZoneType).toBe("ECONOMIC_ACTIVITY_ZONE");
      expect(result.site.landParcels).toHaveLength(2);
      expect(result.site.soilsDistribution).toEqual(
        createSoilSurfaceAreaDistribution({
          BUILDINGS: 3000,
          IMPERMEABLE_SOILS: 2000,
          MINERAL_SOIL: 1000,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1000,
        }),
      );
      expect(result.site.surfaceArea).toBe(7000);
    });

    it("cannot create urban zone site with non-uuid id", () => {
      const result = createUrbanZoneSite({
        ...minimalProps,
        id: "not-a-uuid",
      }) as UrbanZoneErrorResult;
      expect(result.success).toBe(false);
      expect(result.error.fieldErrors.id).toHaveLength(1);
    });

    it("cannot create urban zone site with empty land parcels", () => {
      const result = createUrbanZoneSite({
        ...minimalProps,
        landParcels: [],
      }) as UrbanZoneErrorResult;
      expect(result.success).toBe(false);
      expect(result.error.fieldErrors.landParcels).toHaveLength(1);
    });

    it("should set default owner when none provided", () => {
      const result = createUrbanZoneSite({
        ...minimalProps,
        owner: undefined,
      }) as UrbanZoneSuccessResult;
      expect(result.success).toBe(true);
      expect(result.site.owner).toEqual({ name: "Propriétaire inconnu", structureType: "unknown" });
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
      expect(result.success).toBe(true);
      expect(result.site).toEqual<UrbanZoneSite>({
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
