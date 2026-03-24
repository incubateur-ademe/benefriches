import { Address } from "shared";
import { v4 as uuid } from "uuid";

import { InMemoryCreateSiteService } from "@/features/create-site/infrastructure/create-site-service/inMemoryCreateSiteApi";
import { buildUser } from "@/features/onboarding/core/user.mock";

import { StoreBuilder } from "../__tests__/creation-steps/testUtils";
import { urbanZoneSiteSaved } from "./urbanZoneSiteSaved.action";

const BLAJAN_ADDRESS: Address = {
  banId: "31070_p4ur8e",
  value: "Sendere 31350 Blajan",
  city: "Blajan",
  cityCode: "31070",
  postCode: "31350",
  streetName: "Sendere",
  long: 0.664699,
  lat: 43.260859,
};

describe("urbanZoneSiteSaved", () => {
  it("should be in error state when urban zone data in store is not valid", async () => {
    const store = new StoreBuilder()
      .withCreationData({
        id: uuid(),
        nature: "URBAN_ZONE",
        address: BLAJAN_ADDRESS,
      })
      .withUrbanZoneSteps({
        URBAN_ZONE_LAND_PARCELS_SELECTION: {
          completed: true,
          payload: { landParcelTypes: ["COMMERCIAL_ACTIVITY_AREA"] },
        },
        URBAN_ZONE_MANAGER: {
          completed: true,
          payload: { structureType: "activity_park_manager" },
        },
        URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
          completed: true,
          payload: { surfaceArea: 0 },
        },
        URBAN_ZONE_NAMING: {
          completed: true,
          payload: { name: "Zone urbaine test" },
        },
      })
      .withUrbanZoneCurrentStep("URBAN_ZONE_FINAL_SUMMARY")
      .withCurrentUser(buildUser())
      .build();

    await store.dispatch(urbanZoneSiteSaved());

    expect(store.getState().siteCreation.urbanZone.currentStep).toEqual(
      "URBAN_ZONE_CREATION_RESULT",
    );
    expect(store.getState().siteCreation.urbanZone.saveState).toEqual("error");
    expect(store.getState().siteCreation.saveLoadingState).toEqual("error");
  });

  it("should save urban zone data, including yearly finances, and move to URBAN_ZONE_CREATION_RESULT", async () => {
    const createSiteService = new InMemoryCreateSiteService();
    const user = buildUser();
    const siteId = uuid();
    const store = new StoreBuilder()
      .withCreationData({
        id: siteId,
        nature: "URBAN_ZONE",
        address: BLAJAN_ADDRESS,
        owner: { structureType: "municipality", name: "Ville de Blajan" },
        urbanZoneType: "ECONOMIC_ACTIVITY_ZONE",
      })
      .withUrbanZoneSteps({
        URBAN_ZONE_LAND_PARCELS_SELECTION: {
          completed: true,
          payload: { landParcelTypes: ["COMMERCIAL_ACTIVITY_AREA", "PUBLIC_SPACES"] },
        },
        URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION: {
          completed: true,
          payload: {
            surfaceAreas: {
              COMMERCIAL_ACTIVITY_AREA: 5000,
              PUBLIC_SPACES: 2000,
            },
          },
        },
        URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION: {
          completed: true,
          payload: {
            soilsDistribution: {
              BUILDINGS: 2500,
              IMPERMEABLE_SOILS: 1500,
              MINERAL_SOIL: 1000,
            },
          },
        },
        URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA: {
          completed: true,
          payload: { buildingsFloorSurfaceArea: 3200 },
        },
        URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION: {
          completed: true,
          payload: {
            soilsDistribution: {
              MINERAL_SOIL: 1200,
              ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 800,
            },
          },
        },
        URBAN_ZONE_SOILS_CONTAMINATION: {
          completed: true,
          payload: { hasContaminatedSoils: true, contaminatedSoilSurface: 150 },
        },
        URBAN_ZONE_MANAGER: {
          completed: true,
          payload: { structureType: "activity_park_manager" },
        },
        URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
          completed: true,
          payload: { surfaceArea: 900 },
        },
        URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA: {
          completed: true,
          payload: { surfaceArea: 1200 },
        },
        URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT: {
          completed: true,
          payload: { fullTimeJobs: 42 },
        },
        URBAN_ZONE_VACANT_PREMISES_EXPENSES: {
          completed: true,
          payload: {
            ownerPropertyTaxes: 1000,
            tenantRent: 2400,
          },
        },
        URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES: {
          completed: true,
          payload: {
            maintenance: 800,
          },
        },
        URBAN_ZONE_ZONE_MANAGEMENT_INCOME: {
          completed: true,
          payload: {
            subsidies: 1200,
            otherIncome: 300,
          },
        },
        URBAN_ZONE_NAMING: {
          completed: true,
          payload: { name: "ZAE Blajan", description: "Zone d'activites" },
        },
      })
      .withUrbanZoneCurrentStep("URBAN_ZONE_FINAL_SUMMARY")
      .withAppDependencies({ createSiteService })
      .withCurrentUser(user)
      .build();

    await store.dispatch(urbanZoneSiteSaved());

    expect(store.getState().siteCreation.urbanZone.currentStep).toEqual(
      "URBAN_ZONE_CREATION_RESULT",
    );
    expect(store.getState().siteCreation.urbanZone.saveState).toEqual("success");
    expect(store.getState().siteCreation.saveLoadingState).toEqual("success");
    expect(createSiteService._customSites).toEqual([
      {
        id: siteId,
        createdBy: user.id,
        nature: "URBAN_ZONE",
        name: "ZAE Blajan",
        description: "Zone d'activites",
        address: BLAJAN_ADDRESS,
        owner: { structureType: "municipality", name: "Ville de Blajan" },
        yearlyExpenses: [
          { purpose: "propertyTaxes", amount: 1000, bearer: "owner" },
          { purpose: "rent", amount: 2400, bearer: "tenant" },
          { purpose: "maintenance", amount: 800, bearer: "owner" },
        ],
        yearlyIncomes: [
          { source: "subsidies", amount: 1200 },
          { source: "other", amount: 300 },
        ],
        urbanZoneType: "ECONOMIC_ACTIVITY_ZONE",
        landParcels: [
          {
            type: "COMMERCIAL_ACTIVITY_AREA",
            surfaceArea: 5000,
            buildingsFloorSurfaceArea: 3200,
            soilsDistribution: {
              BUILDINGS: 2500,
              IMPERMEABLE_SOILS: 1500,
              MINERAL_SOIL: 1000,
            },
          },
          {
            type: "PUBLIC_SPACES",
            surfaceArea: 2000,
            soilsDistribution: {
              MINERAL_SOIL: 1200,
              ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 800,
            },
          },
        ],
        hasContaminatedSoils: true,
        contaminatedSoilSurface: 150,
        manager: {
          structureType: "activity_park_manager",
          name: "Gestionnaire de parc d'activité",
        },
        vacantCommercialPremisesFootprint: 900,
        vacantCommercialPremisesFloorArea: 1200,
        fullTimeJobsEquivalent: 42,
      },
    ]);
  });
});
