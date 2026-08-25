import { Address } from "shared";

import { InMemoryCreateSiteService } from "../../../infrastructure/create-site-service/inMemoryCreateSiteApi";
import { addressStepCompleted } from "../../steps/address/address.actions";
import {
  introductionStepCompleted,
  isFricheCompleted,
  siteCreationInitiated,
  siteNatureCompleted,
} from "../../steps/introduction/introduction.actions";
import { siteSurfaceAreaStepCompleted } from "../../steps/spaces/spaces.actions";
import {
  urbanZoneLandParcelsIntroductionCompleted,
  urbanZoneTypeCompleted,
} from "../../steps/urban-zone/urbanZone.actions";
import { nextStepRequested, stepCompletionRequested } from "../../urban-zone/urban-zone.actions";
import { urbanZoneSiteSaved } from "../../urban-zone/urbanZoneSiteSaved.action";
import { buildBehaviourNetStore, currentStep, saveLoadingState, siteId } from "./testHelpers";

const ADDRESS: Address = {
  banId: "31070_p4ur8e",
  value: "Sendere 31350 Blajan",
  city: "Blajan",
  cityCode: "31070",
  postCode: "31350",
  streetName: "Sendere",
  long: 0.664699,
  lat: 43.260859,
};

describe("Site creation behaviour net — urban zone", () => {
  it("walks a fully-answered urban-zone wizard, asserting the current step at each branch and the exact submitted payload", async () => {
    const createSiteService = new InMemoryCreateSiteService();
    const { store, user } = buildBehaviourNetStore(createSiteService);

    store.dispatch(siteCreationInitiated({ createMode: "custom" }));
    store.dispatch(introductionStepCompleted());

    store.dispatch(isFricheCompleted({ isFriche: false }));
    expect(currentStep(store)).toEqual("SITE_NATURE");

    store.dispatch(siteNatureCompleted({ nature: "URBAN_ZONE" }));
    expect(currentStep(store)).toEqual("URBAN_ZONE_TYPE");

    store.dispatch(urbanZoneTypeCompleted({ urbanZoneType: "ECONOMIC_ACTIVITY_ZONE" }));
    expect(currentStep(store)).toEqual("ADDRESS");

    store.dispatch(addressStepCompleted({ address: ADDRESS }));
    // branch: nature URBAN_ZONE -> land parcels introduction instead of SPACES_INTRODUCTION
    expect(currentStep(store)).toEqual("URBAN_ZONE_LAND_PARCELS_INTRODUCTION");

    store.dispatch(urbanZoneLandParcelsIntroductionCompleted());
    expect(currentStep(store)).toEqual("SURFACE_AREA");

    store.dispatch(siteSurfaceAreaStepCompleted({ surfaceArea: 7000 }));
    // branch: completing SURFACE_AREA for a custom urban zone hands off to the urban-zone
    // step-handler system — selectCurrentStep must resolve through the sentinel to it
    expect(currentStep(store)).toEqual("URBAN_ZONE_LAND_PARCELS_SELECTION");

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_LAND_PARCELS_SELECTION",
        answers: { landParcelTypes: ["COMMERCIAL_ACTIVITY_AREA", "PUBLIC_SPACES"] },
      }),
    );
    expect(currentStep(store)).toEqual("URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION");

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
        answers: { surfaceAreas: { COMMERCIAL_ACTIVITY_AREA: 5000, PUBLIC_SPACES: 2000 } },
      }),
    );
    expect(currentStep(store)).toEqual("URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION");

    store.dispatch(nextStepRequested());
    expect(currentStep(store)).toEqual("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION");

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION",
        answers: {
          soilsDistribution: { BUILDINGS: 2500, IMPERMEABLE_SOILS: 1500, MINERAL_SOIL: 1000 },
        },
      }),
    );
    // branch: soils include BUILDINGS -> the parcel's buildings floor area is asked
    expect(currentStep(store)).toEqual("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA");

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA",
        answers: { buildingsFloorSurfaceArea: 3200 },
      }),
    );
    // branch: another selected parcel type remains -> its soils step comes next
    expect(currentStep(store)).toEqual("URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION");

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION",
        answers: {
          soilsDistribution: { MINERAL_SOIL: 1200, ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 800 },
        },
      }),
    );
    // branch: no BUILDINGS in these soils and no further parcel type -> soils summary
    expect(currentStep(store)).toEqual("URBAN_ZONE_SOILS_SUMMARY");

    store.dispatch(nextStepRequested());
    expect(currentStep(store)).toEqual("URBAN_ZONE_SOILS_CARBON_STORAGE");

    store.dispatch(nextStepRequested());
    expect(currentStep(store)).toEqual("URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION");

    store.dispatch(nextStepRequested());
    expect(currentStep(store)).toEqual("URBAN_ZONE_SOILS_CONTAMINATION");

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_SOILS_CONTAMINATION",
        answers: { hasContaminatedSoils: true, contaminatedSoilSurface: 150 },
      }),
    );
    // branch: contamination answered -> management section
    expect(currentStep(store)).toEqual("URBAN_ZONE_MANAGEMENT_INTRODUCTION");

    store.dispatch(nextStepRequested());
    expect(currentStep(store)).toEqual("URBAN_ZONE_MANAGER");

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_MANAGER",
        answers: { structureType: "activity_park_manager" },
      }),
    );
    expect(currentStep(store)).toEqual("URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT");

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
        answers: { surfaceArea: 900 },
      }),
    );
    // branch: some vacant premises footprint (900 > 0) -> its floor area is asked next
    expect(currentStep(store)).toEqual("URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA");

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA",
        answers: { surfaceArea: 1200 },
      }),
    );
    expect(currentStep(store)).toEqual("URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT");

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT",
        answers: { fullTimeJobs: 42 },
      }),
    );
    expect(currentStep(store)).toEqual("URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION");

    store.dispatch(nextStepRequested());
    // branch: activity park manager with vacant premises -> vacant premises expenses first
    expect(currentStep(store)).toEqual("URBAN_ZONE_VACANT_PREMISES_EXPENSES");

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_VACANT_PREMISES_EXPENSES",
        answers: { ownerPropertyTaxes: 1000, tenantRent: 2400 },
      }),
    );
    // branch: the zone also has activity (footprint < total surface) -> zone management expenses
    expect(currentStep(store)).toEqual("URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES");

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES",
        answers: { maintenance: 800 },
      }),
    );
    expect(currentStep(store)).toEqual("URBAN_ZONE_ZONE_MANAGEMENT_INCOME");

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_ZONE_MANAGEMENT_INCOME",
        answers: { subsidies: 1200, otherIncome: 300 },
      }),
    );
    expect(currentStep(store)).toEqual("URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY");

    store.dispatch(nextStepRequested());
    expect(currentStep(store)).toEqual("URBAN_ZONE_NAMING_INTRODUCTION");

    store.dispatch(nextStepRequested());
    expect(currentStep(store)).toEqual("URBAN_ZONE_NAMING");

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_NAMING",
        answers: { name: "ZAE Blajan", description: "Zone d'activites" },
      }),
    );
    expect(currentStep(store)).toEqual("URBAN_ZONE_FINAL_SUMMARY");

    await store.dispatch(urbanZoneSiteSaved());

    expect(currentStep(store)).toEqual("URBAN_ZONE_CREATION_RESULT");
    expect(saveLoadingState(store)).toEqual("success");
    expect(createSiteService._customSites).toEqual([
      {
        id: siteId(store),
        createdBy: user.id,
        nature: "URBAN_ZONE",
        name: "ZAE Blajan",
        description: "Zone d'activites",
        address: ADDRESS,
        owner: undefined,
        tenant: undefined,
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
