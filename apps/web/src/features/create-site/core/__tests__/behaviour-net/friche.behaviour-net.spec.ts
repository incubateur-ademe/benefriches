import { Address } from "shared";

import { InMemoryCreateSiteService } from "../../../infrastructure/create-site-service/inMemoryCreateSiteApi";
import { addressStepCompleted } from "../../steps/address/address.actions";
import { soilsContaminationIntroductionStepCompleted } from "../../steps/contamination-and-accidents/contaminationAndAccidents.actions";
import {
  fricheAccidentsIntroductionStepCompleted,
  fricheAccidentsStepCompleted,
  soilsContaminationStepCompleted,
} from "../../steps/contamination-and-accidents/contaminationAndAccidents.actions";
import { customSiteSaved } from "../../steps/final/final.actions";
import {
  introductionStepCompleted,
  isFricheCompleted,
  mutabilityOrImpactsSelectionCompleted,
  siteCreationInitiated,
} from "../../steps/introduction/introduction.actions";
import {
  namingIntroductionStepCompleted,
  namingStepCompleted,
} from "../../steps/naming/naming.actions";
import { fricheActivityStepCompleted } from "../../steps/site-activity/siteActivity.actions";
import {
  isFricheLeasedStepCompleted,
  managementIntroductionCompleted,
  ownerStepCompleted,
  tenantStepCompleted,
  yearlyExpensesAndIncomeIntroductionCompleted,
  yearlyExpensesStepCompleted,
  yearlyExpensesSummaryCompleted,
} from "../../steps/site-management/siteManagement.actions";
import {
  siteSurfaceAreaStepCompleted,
  soilsCarbonStorageStepCompleted,
  soilsDistributionStepCompleted,
  soilsIntroductionStepCompleted,
  soilsSelectionStepCompleted,
  soilsSummaryStepCompleted,
  spacesKnowledgeStepCompleted,
  spacesSurfaceAreaDistributionKnowledgeCompleted,
} from "../../steps/spaces/spaces.actions";
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

describe("Site creation behaviour net — friche", () => {
  it("walks a fully-answered friche wizard, asserting the current step at each branch and the exact submitted payload", async () => {
    const createSiteService = new InMemoryCreateSiteService();
    const { store, user } = buildBehaviourNetStore(createSiteService);

    store.dispatch(siteCreationInitiated({ createMode: "custom" }));
    store.dispatch(introductionStepCompleted());

    // branch: isFriche -> USE_MUTABILITY shown (skipUseMutability is false by default)
    store.dispatch(isFricheCompleted({ isFriche: true }));
    expect(currentStep(store)).toEqual("USE_MUTABILITY");

    store.dispatch(mutabilityOrImpactsSelectionCompleted({ useMutability: false }));
    expect(currentStep(store)).toEqual("FRICHE_ACTIVITY");

    store.dispatch(fricheActivityStepCompleted("INDUSTRY"));
    expect(currentStep(store)).toEqual("ADDRESS");

    store.dispatch(addressStepCompleted({ address: ADDRESS }));
    // branch: nature !== URBAN_ZONE -> SPACES_INTRODUCTION
    expect(currentStep(store)).toEqual("SPACES_INTRODUCTION");

    store.dispatch(soilsIntroductionStepCompleted());
    expect(currentStep(store)).toEqual("SURFACE_AREA");

    store.dispatch(siteSurfaceAreaStepCompleted({ surfaceArea: 30000 }));
    expect(currentStep(store)).toEqual("SPACES_KNOWLEDGE");

    // branch: knowsSpaces true -> manual soils selection
    store.dispatch(spacesKnowledgeStepCompleted({ knowsSpaces: true }));
    expect(currentStep(store)).toEqual("SPACES_SELECTION");

    store.dispatch(soilsSelectionStepCompleted({ soils: ["BUILDINGS", "MINERAL_SOIL"] }));
    // branch: more than one soil type -> ask for the surface-area distribution
    expect(currentStep(store)).toEqual("SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE");

    store.dispatch(spacesSurfaceAreaDistributionKnowledgeCompleted({ knowsSurfaceAreas: true }));
    expect(currentStep(store)).toEqual("SPACES_SURFACE_AREA_DISTRIBUTION");

    store.dispatch(
      soilsDistributionStepCompleted({
        distribution: { BUILDINGS: 20000, MINERAL_SOIL: 10000 },
      }),
    );
    expect(currentStep(store)).toEqual("SOILS_SUMMARY");

    store.dispatch(soilsSummaryStepCompleted());
    expect(currentStep(store)).toEqual("SOILS_CARBON_STORAGE");

    store.dispatch(soilsCarbonStorageStepCompleted());
    // branch: isFriche -> contamination/accidents steps are shown
    expect(currentStep(store)).toEqual("SOILS_CONTAMINATION_INTRODUCTION");

    store.dispatch(soilsContaminationIntroductionStepCompleted());
    expect(currentStep(store)).toEqual("SOILS_CONTAMINATION");

    store.dispatch(
      soilsContaminationStepCompleted({
        hasContaminatedSoils: true,
        contaminatedSoilSurface: 2300,
      }),
    );
    expect(currentStep(store)).toEqual("FRICHE_ACCIDENTS_INTRODUCTION");

    store.dispatch(fricheAccidentsIntroductionStepCompleted());
    expect(currentStep(store)).toEqual("FRICHE_ACCIDENTS");

    store.dispatch(
      fricheAccidentsStepCompleted({
        hasRecentAccidents: true,
        accidentsMinorInjuries: 2,
        accidentsSevereInjuries: 1,
        accidentsDeaths: 0,
      }),
    );
    expect(currentStep(store)).toEqual("MANAGEMENT_INTRODUCTION");

    store.dispatch(managementIntroductionCompleted());
    expect(currentStep(store)).toEqual("OWNER");

    store.dispatch(ownerStepCompleted({ owner: { structureType: "company", name: "SAS Owner" } }));
    // branch: nature FRICHE -> is it leased?
    expect(currentStep(store)).toEqual("IS_FRICHE_LEASED");

    store.dispatch(isFricheLeasedStepCompleted({ isFricheLeased: true }));
    // branch: leased -> TENANT
    expect(currentStep(store)).toEqual("TENANT");

    store.dispatch(
      tenantStepCompleted({ tenant: { structureType: "company", name: "Tenant SARL" } }),
    );
    expect(currentStep(store)).toEqual("YEARLY_EXPENSES_AND_INCOME_INTRODUCTION");

    store.dispatch(yearlyExpensesAndIncomeIntroductionCompleted());
    expect(currentStep(store)).toEqual("YEARLY_EXPENSES");

    store.dispatch(
      yearlyExpensesStepCompleted([{ purpose: "propertyTaxes", amount: 3900, bearer: "owner" }]),
    );
    // branch: isSiteOperated is not set for a friche -> no YEARLY_INCOME step
    expect(currentStep(store)).toEqual("YEARLY_EXPENSES_SUMMARY");

    store.dispatch(yearlyExpensesSummaryCompleted());
    expect(currentStep(store)).toEqual("NAMING_INTRODUCTION");

    store.dispatch(namingIntroductionStepCompleted());
    expect(currentStep(store)).toEqual("NAMING");

    store.dispatch(
      namingStepCompleted({ name: "Friche Blajan", description: "Description of the friche" }),
    );
    expect(currentStep(store)).toEqual("FINAL_SUMMARY");

    await store.dispatch(customSiteSaved());

    expect(currentStep(store)).toEqual("CREATION_RESULT");
    expect(saveLoadingState(store)).toEqual("success");
    expect(createSiteService._customSites).toEqual([
      {
        id: siteId(store),
        createdBy: user.id,
        nature: "FRICHE",
        name: "Friche Blajan",
        description: "Description of the friche",
        address: ADDRESS,
        owner: { structureType: "company", name: "SAS Owner" },
        tenant: { structureType: "company", name: "Tenant SARL" },
        yearlyExpenses: [{ purpose: "propertyTaxes", amount: 3900, bearer: "owner" }],
        yearlyIncomes: [],
        fricheActivity: "INDUSTRY",
        soilsDistribution: { BUILDINGS: 20000, MINERAL_SOIL: 10000 },
        contaminatedSoilSurface: 2300,
        accidentsMinorInjuries: 2,
        accidentsSevereInjuries: 1,
        accidentsDeaths: 0,
      },
    ]);
  });
});
