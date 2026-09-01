import type { Address, GetSiteFeaturesResponseDto } from "shared";
import { describe, expect, it } from "vitest";

import { buildUrbanZoneSiteDataForSave } from "@/features/create-site/core/urban-zone/buildUrbanZoneSitePayload";
import { urbanZoneStepHandlerRegistry } from "@/features/create-site/core/urban-zone/stepHandlerRegistry";
import { computeStepsSequence } from "@/shared/core/wizard-form/helpers/stepsSequence";

import { convertSiteToCustomSteps } from "./convertSiteToCustomSteps";
import { convertSiteToUrbanZoneSteps } from "./convertSiteToUrbanZoneSteps";

const BASE_ADDRESS: Address = {
  banId: "addr-1",
  city: "Lyon",
  cityCode: "69123",
  postCode: "69001",
  streetName: "Rue de la Zone",
  streetNumber: "10",
  value: "10 Rue de la Zone, 69001 Lyon",
  long: 4.83,
  lat: 45.76,
};

type UrbanZoneFeatures = Extract<GetSiteFeaturesResponseDto, { nature: "URBAN_ZONE" }>;

// Walks the reconstructed step sequence the same way the update reducer does: the custom
// engine's own hydrated ADDRESS/SURFACE_AREA/URBAN_ZONE_TYPE feed the urban-zone context.
const walkSequence = (features: UrbanZoneFeatures) => {
  const customSteps = convertSiteToCustomSteps(features);
  const siteData = {
    id: features.id,
    nature: "URBAN_ZONE" as const,
    address: customSteps.ADDRESS?.payload?.address,
    surfaceArea: customSteps.SURFACE_AREA?.payload?.surfaceArea,
    urbanZoneType: customSteps.URBAN_ZONE_TYPE?.payload?.urbanZoneType,
    soils: [],
    yearlyExpenses: [],
    yearlyIncomes: [],
  };
  const urbanZoneSteps = convertSiteToUrbanZoneSteps(features);
  const sequence = computeStepsSequence(
    { context: { siteData }, answers: urbanZoneSteps },
    "URBAN_ZONE_LAND_PARCELS_SELECTION",
    urbanZoneStepHandlerRegistry,
  );
  return { urbanZoneSteps, sequence, siteData };
};

const TWO_PARCEL_FEATURES: UrbanZoneFeatures = {
  id: "site-1",
  name: "Zone Nord",
  description: "Une zone urbaine test",
  nature: "URBAN_ZONE",
  isExpressSite: false,
  owner: { structureType: "company", name: "Owner Corp" },
  soilsDistribution: {},
  surfaceArea: 15000,
  address: BASE_ADDRESS,
  yearlyExpenses: [],
  yearlyIncomes: [],
  urbanZoneType: "ECONOMIC_ACTIVITY_ZONE",
  landParcels: [
    {
      type: "COMMERCIAL_ACTIVITY_AREA",
      surfaceArea: 10000,
      soilsDistribution: { BUILDINGS: 6000, IMPERMEABLE_SOILS: 4000 },
      buildingsFloorSurfaceArea: 4500,
    },
    {
      type: "PUBLIC_SPACES",
      surfaceArea: 5000,
      soilsDistribution: { MINERAL_SOIL: 5000 },
    },
  ],
  hasContaminatedSoils: false,
  manager: { structureType: "activity_park_manager", name: "" },
  vacantCommercialPremisesFootprint: 0,
  fullTimeJobsEquivalent: 12,
};

const SINGLE_PARCEL_LOCAL_AUTHORITY_FEATURES: UrbanZoneFeatures = {
  id: "site-2",
  name: "Zone Sud",
  nature: "URBAN_ZONE",
  isExpressSite: false,
  owner: { structureType: "local_authority", name: "Ville de Lyon" },
  soilsDistribution: {},
  surfaceArea: 8000,
  address: BASE_ADDRESS,
  yearlyExpenses: [{ amount: 500, purpose: "maintenance", bearer: "owner" }],
  yearlyIncomes: [],
  urbanZoneType: "MIXED_URBAN_ZONE",
  landParcels: [
    {
      type: "SERVICED_SURFACE",
      surfaceArea: 8000,
      soilsDistribution: { IMPERMEABLE_SOILS: 8000 },
    },
  ],
  manager: { structureType: "local_authority", name: "Ville de Lyon" },
  vacantCommercialPremisesFootprint: 0,
};

const THREE_PARCEL_FEATURES: UrbanZoneFeatures = {
  id: "site-3",
  name: "Zone Est",
  nature: "URBAN_ZONE",
  isExpressSite: false,
  owner: { structureType: "company", name: "Owner Corp" },
  soilsDistribution: {},
  surfaceArea: 20000,
  address: BASE_ADDRESS,
  yearlyExpenses: [],
  yearlyIncomes: [],
  urbanZoneType: "ECONOMIC_ACTIVITY_ZONE",
  landParcels: [
    {
      type: "COMMERCIAL_ACTIVITY_AREA",
      surfaceArea: 8000,
      soilsDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 5000 },
      buildingsFloorSurfaceArea: 2500,
    },
    {
      type: "PUBLIC_SPACES",
      surfaceArea: 7000,
      soilsDistribution: { BUILDINGS: 1000, MINERAL_SOIL: 6000 },
      buildingsFloorSurfaceArea: 800,
    },
    {
      type: "RESERVED_SURFACE",
      surfaceArea: 5000,
      soilsDistribution: { PRAIRIE_GRASS: 5000 },
    },
  ],
  manager: { structureType: "activity_park_manager", name: "" },
  vacantCommercialPremisesFootprint: 0,
};

describe("convertSiteToUrbanZoneSteps", () => {
  describe("per-parcel step hydration", () => {
    it("lands each parcel's soils distribution on its own static step id", () => {
      const steps = convertSiteToUrbanZoneSteps(TWO_PARCEL_FEATURES);

      expect(steps.URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION).toEqual({
        completed: true,
        payload: { soilsDistribution: { BUILDINGS: 6000, IMPERMEABLE_SOILS: 4000 } },
        defaultValues: { soilsDistribution: { BUILDINGS: 6000, IMPERMEABLE_SOILS: 4000 } },
      });
      expect(steps.URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION).toEqual({
        completed: true,
        payload: { soilsDistribution: { MINERAL_SOIL: 5000 } },
        defaultValues: { soilsDistribution: { MINERAL_SOIL: 5000 } },
      });
    });

    it("hydrates the buildings floor-area step only for the parcel that has BUILDINGS", () => {
      const steps = convertSiteToUrbanZoneSteps(TWO_PARCEL_FEATURES);

      expect(steps.URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA).toEqual({
        completed: true,
        payload: { buildingsFloorSurfaceArea: 4500 },
        defaultValues: { buildingsFloorSurfaceArea: 4500 },
      });
      expect(steps.URBAN_ZONE_PUBLIC_SPACES_BUILDINGS_FLOOR_AREA).toBeUndefined();
    });

    it("hydrates URBAN_ZONE_LAND_PARCELS_SELECTION and SURFACE_DISTRIBUTION for every parcel", () => {
      const steps = convertSiteToUrbanZoneSteps(TWO_PARCEL_FEATURES);

      expect(steps.URBAN_ZONE_LAND_PARCELS_SELECTION).toEqual({
        completed: true,
        payload: { landParcelTypes: ["COMMERCIAL_ACTIVITY_AREA", "PUBLIC_SPACES"] },
      });
      expect(steps.URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION).toEqual({
        completed: true,
        payload: { surfaceAreas: { COMMERCIAL_ACTIVITY_AREA: 10000, PUBLIC_SPACES: 5000 } },
      });
    });

    it("hydrates all six per-parcel step ids for a three-parcel site and no others", () => {
      const { urbanZoneSteps } = walkSequence(THREE_PARCEL_FEATURES);

      expect(urbanZoneSteps.URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION).toBeDefined();
      expect(urbanZoneSteps.URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA).toBeDefined();
      expect(urbanZoneSteps.URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION).toBeDefined();
      expect(urbanZoneSteps.URBAN_ZONE_PUBLIC_SPACES_BUILDINGS_FLOOR_AREA).toBeDefined();
      expect(urbanZoneSteps.URBAN_ZONE_RESERVED_SURFACE_SOILS_DISTRIBUTION).toBeDefined();
      expect(urbanZoneSteps.URBAN_ZONE_RESERVED_SURFACE_BUILDINGS_FLOOR_AREA).toBeUndefined();
      expect(urbanZoneSteps.URBAN_ZONE_SERVICED_SURFACE_SOILS_DISTRIBUTION).toBeUndefined();
    });
  });

  describe("single-parcel site", () => {
    it("hydrates SURFACE_DISTRIBUTION with the whole site surface on the one parcel", () => {
      const steps = convertSiteToUrbanZoneSteps(SINGLE_PARCEL_LOCAL_AUTHORITY_FEATURES);

      expect(steps.URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION).toEqual({
        completed: true,
        payload: { surfaceAreas: { SERVICED_SURFACE: 8000 } },
      });
    });

    it("hydrates a single soils-distribution step and no floor-area step (no BUILDINGS)", () => {
      const steps = convertSiteToUrbanZoneSteps(SINGLE_PARCEL_LOCAL_AUTHORITY_FEATURES);

      expect(steps.URBAN_ZONE_SERVICED_SURFACE_SOILS_DISTRIBUTION).toEqual({
        completed: true,
        payload: { soilsDistribution: { IMPERMEABLE_SOILS: 8000 } },
        defaultValues: { soilsDistribution: { IMPERMEABLE_SOILS: 8000 } },
      });
      expect(steps.URBAN_ZONE_SERVICED_SURFACE_BUILDINGS_FLOOR_AREA).toBeUndefined();
    });

    it("hydrates the local-authority expenses branch, not the activity-park one", () => {
      const steps = convertSiteToUrbanZoneSteps(SINGLE_PARCEL_LOCAL_AUTHORITY_FEATURES);

      expect(steps.URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES).toEqual({
        completed: true,
        payload: { maintenance: 500, otherManagementCosts: undefined },
      });
      expect(steps.URBAN_ZONE_VACANT_PREMISES_EXPENSES).toBeUndefined();
      expect(steps.URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES).toBeUndefined();
    });
  });

  describe("manager and activity-park branch", () => {
    it("hydrates URBAN_ZONE_MANAGER as activity_park_manager", () => {
      const steps = convertSiteToUrbanZoneSteps(TWO_PARCEL_FEATURES);

      expect(steps.URBAN_ZONE_MANAGER).toEqual({
        completed: true,
        payload: { structureType: "activity_park_manager" },
      });
    });

    it("hydrates the full-time-jobs-equivalent step", () => {
      const steps = convertSiteToUrbanZoneSteps(TWO_PARCEL_FEATURES);

      expect(steps.URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT).toEqual({
        completed: true,
        payload: { fullTimeJobs: 12 },
      });
    });

    it("hydrates the footprint step but not the floor-area step for a zero footprint", () => {
      const steps = convertSiteToUrbanZoneSteps(TWO_PARCEL_FEATURES);

      expect(steps.URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT).toEqual({
        completed: true,
        payload: { surfaceArea: 0 },
      });
      expect(steps.URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA).toBeUndefined();
    });
  });

  describe("vacant premises with remaining activity", () => {
    const VACANT_AND_ACTIVITY_FEATURES: UrbanZoneFeatures = {
      ...TWO_PARCEL_FEATURES,
      surfaceArea: 15000,
      vacantCommercialPremisesFootprint: 3000,
      vacantCommercialPremisesFloorArea: 2800,
      yearlyExpenses: [
        { amount: 400, purpose: "propertyTaxes", bearer: "owner" },
        { amount: 1200, purpose: "rent", bearer: "tenant" },
        { amount: 300, purpose: "maintenance", bearer: "owner" },
      ],
      yearlyIncomes: [{ amount: 900, source: "rent" }],
    };

    it("hydrates the vacant-premises footprint and floor-area steps", () => {
      const steps = convertSiteToUrbanZoneSteps(VACANT_AND_ACTIVITY_FEATURES);

      expect(steps.URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT).toEqual({
        completed: true,
        payload: { surfaceArea: 3000 },
      });
      expect(steps.URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA).toEqual({
        completed: true,
        payload: { surfaceArea: 2800 },
      });
    });

    it("hydrates both the vacant-premises and zone-management expense/income steps", () => {
      const steps = convertSiteToUrbanZoneSteps(VACANT_AND_ACTIVITY_FEATURES);

      expect(steps.URBAN_ZONE_VACANT_PREMISES_EXPENSES?.payload?.ownerPropertyTaxes).toBe(400);
      expect(steps.URBAN_ZONE_VACANT_PREMISES_EXPENSES?.payload?.tenantRent).toBe(1200);
      expect(steps.URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES?.payload?.maintenance).toBe(300);
      expect(steps.URBAN_ZONE_ZONE_MANAGEMENT_INCOME?.payload?.rent).toBe(900);
    });
  });

  describe("round-trip guard: no orphan answers, exact sequence", () => {
    const CASES: { name: string; features: UrbanZoneFeatures }[] = [
      { name: "two-parcel activity park manager", features: TWO_PARCEL_FEATURES },
      { name: "single-parcel local authority", features: SINGLE_PARCEL_LOCAL_AUTHORITY_FEATURES },
      { name: "three-parcel activity park manager", features: THREE_PARCEL_FEATURES },
    ];

    for (const { name, features } of CASES) {
      it(`walks a sequence containing exactly the hydrated answer keys for: ${name}`, () => {
        const { urbanZoneSteps, sequence } = walkSequence(features);

        const hydratedAnswerKeys = Object.keys(urbanZoneSteps);
        for (const key of hydratedAnswerKeys) {
          expect(sequence, `expected ${key} to be walked`).toContain(key);
        }
      });
    }

    it("walks the expected per-parcel step order for the two-parcel site", () => {
      const { sequence } = walkSequence(TWO_PARCEL_FEATURES);

      const commercialSoilsIndex = sequence.indexOf(
        "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION",
      );
      const commercialFloorIndex = sequence.indexOf(
        "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA",
      );
      const publicSoilsIndex = sequence.indexOf("URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION");

      expect(commercialSoilsIndex).toBeGreaterThanOrEqual(0);
      expect(commercialFloorIndex).toBe(commercialSoilsIndex + 1);
      expect(publicSoilsIndex).toBe(commercialFloorIndex + 1);
    });
  });

  describe("save round-trip", () => {
    it("preserves land parcels, manager, vacant-premises fields, ETP and naming for the two-parcel site", () => {
      const { urbanZoneSteps, siteData } = walkSequence(TWO_PARCEL_FEATURES);

      const saved = buildUrbanZoneSiteDataForSave(siteData, urbanZoneSteps);

      expect(saved.landParcels).toEqual(TWO_PARCEL_FEATURES.landParcels);
      expect(saved.manager).toEqual({
        structureType: "activity_park_manager",
        name: "Gestionnaire de parc d'activité",
      });
      expect(saved.vacantCommercialPremisesFootprint).toBe(0);
      expect(saved.fullTimeJobsEquivalent).toBe(12);
      expect(saved.name).toBe(TWO_PARCEL_FEATURES.name);
      expect(saved.description).toBe(TWO_PARCEL_FEATURES.description);
    });

    it("preserves land parcels and manager for the single-parcel local-authority site", () => {
      const { urbanZoneSteps, siteData } = walkSequence(SINGLE_PARCEL_LOCAL_AUTHORITY_FEATURES);

      const saved = buildUrbanZoneSiteDataForSave(siteData, urbanZoneSteps);

      expect(saved.landParcels).toEqual(SINGLE_PARCEL_LOCAL_AUTHORITY_FEATURES.landParcels);
      expect(saved.manager?.structureType).toBe("local_authority");
      expect(saved.manager?.name).toBe("Ville de Lyon");
    });

    it("preserves land parcels for the three-parcel site", () => {
      const { urbanZoneSteps, siteData } = walkSequence(THREE_PARCEL_FEATURES);

      const saved = buildUrbanZoneSiteDataForSave(siteData, urbanZoneSteps);

      expect(saved.landParcels).toEqual(THREE_PARCEL_FEATURES.landParcels);
    });
  });
});
