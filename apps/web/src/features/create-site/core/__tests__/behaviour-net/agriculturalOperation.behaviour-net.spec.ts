import { Address, getSoilsDistributionForAgriculturalOperationActivity } from "shared";

import { InMemoryCreateSiteService } from "../../../infrastructure/create-site-service/inMemoryCreateSiteApi";
import { addressStepCompleted } from "../../steps/address/address.actions";
import { customSiteSaved } from "../../steps/final/final.actions";
import {
  introductionStepCompleted,
  isFricheCompleted,
  siteCreationInitiated,
  siteNatureCompleted,
} from "../../steps/introduction/introduction.actions";
import {
  namingIntroductionStepCompleted,
  namingStepCompleted,
} from "../../steps/naming/naming.actions";
import { agriculturalOperationActivityCompleted } from "../../steps/site-activity/siteActivity.actions";
import {
  isSiteOperatedStepCompleted,
  managementIntroductionCompleted,
  operatorStepCompleted,
  ownerStepCompleted,
  yearlyExpensesAndIncomeIntroductionCompleted,
  yearlyExpensesStepCompleted,
  yearlyExpensesSummaryCompleted,
  yearlyIncomeStepCompleted,
} from "../../steps/site-management/siteManagement.actions";
import {
  siteSurfaceAreaStepCompleted,
  soilsCarbonStorageStepCompleted,
  soilsIntroductionStepCompleted,
  spacesKnowledgeStepCompleted,
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

describe("Site creation behaviour net — agricultural operation", () => {
  it("walks a fully-answered agricultural-operation wizard, asserting the current step at each branch and the exact submitted payload", async () => {
    const createSiteService = new InMemoryCreateSiteService();
    const { store, user } = buildBehaviourNetStore(createSiteService);

    store.dispatch(siteCreationInitiated({ createMode: "custom" }));
    store.dispatch(introductionStepCompleted());

    // branch: not a friche -> SITE_NATURE, no USE_MUTABILITY
    store.dispatch(isFricheCompleted({ isFriche: false }));
    expect(currentStep(store)).toEqual("SITE_NATURE");

    store.dispatch(siteNatureCompleted({ nature: "AGRICULTURAL_OPERATION" }));
    expect(currentStep(store)).toEqual("AGRICULTURAL_OPERATION_ACTIVITY");

    store.dispatch(
      agriculturalOperationActivityCompleted({ activity: "POLYCULTURE_AND_LIVESTOCK" }),
    );
    expect(currentStep(store)).toEqual("ADDRESS");

    store.dispatch(addressStepCompleted({ address: ADDRESS }));
    expect(currentStep(store)).toEqual("SPACES_INTRODUCTION");

    store.dispatch(soilsIntroductionStepCompleted());
    expect(currentStep(store)).toEqual("SURFACE_AREA");

    store.dispatch(siteSurfaceAreaStepCompleted({ surfaceArea: 30000 }));
    expect(currentStep(store)).toEqual("SPACES_KNOWLEDGE");

    // branch: knowsSpaces false -> soils distribution is auto-derived from the activity,
    // skipping straight to the summary
    store.dispatch(spacesKnowledgeStepCompleted({ knowsSpaces: false }));
    expect(currentStep(store)).toEqual("SOILS_SUMMARY");

    store.dispatch(soilsCarbonStorageStepCompleted());
    // branch: not a friche -> contamination/accidents steps are skipped entirely
    expect(currentStep(store)).toEqual("MANAGEMENT_INTRODUCTION");

    store.dispatch(managementIntroductionCompleted());
    expect(currentStep(store)).toEqual("OWNER");

    store.dispatch(ownerStepCompleted({ owner: { structureType: "company", name: "SAS Owner" } }));
    // branch: nature AGRICULTURAL_OPERATION -> is it operated?
    expect(currentStep(store)).toEqual("IS_SITE_OPERATED");

    store.dispatch(isSiteOperatedStepCompleted({ isSiteOperated: true }));
    // branch: operated -> OPERATOR
    expect(currentStep(store)).toEqual("OPERATOR");

    store.dispatch(
      operatorStepCompleted({ tenant: { structureType: "company", name: "Tenant SARL" } }),
    );
    expect(currentStep(store)).toEqual("YEARLY_EXPENSES_AND_INCOME_INTRODUCTION");

    store.dispatch(yearlyExpensesAndIncomeIntroductionCompleted());
    expect(currentStep(store)).toEqual("YEARLY_EXPENSES");

    store.dispatch(
      yearlyExpensesStepCompleted([{ purpose: "propertyTaxes", amount: 3900, bearer: "owner" }]),
    );
    // branch: isSiteOperated true -> a YEARLY_INCOME step is inserted
    expect(currentStep(store)).toEqual("YEARLY_INCOME");

    store.dispatch(yearlyIncomeStepCompleted([{ source: "operations", amount: 150000 }]));
    expect(currentStep(store)).toEqual("YEARLY_EXPENSES_SUMMARY");

    store.dispatch(yearlyExpensesSummaryCompleted());
    expect(currentStep(store)).toEqual("NAMING_INTRODUCTION");

    store.dispatch(namingIntroductionStepCompleted());
    expect(currentStep(store)).toEqual("NAMING");

    store.dispatch(namingStepCompleted({ name: "Ferme Blajan" }));
    expect(currentStep(store)).toEqual("FINAL_SUMMARY");

    await store.dispatch(customSiteSaved());

    expect(currentStep(store)).toEqual("CREATION_RESULT");
    expect(saveLoadingState(store)).toEqual("success");
    expect(createSiteService._customSites).toEqual([
      {
        id: siteId(store),
        createdBy: user.id,
        nature: "AGRICULTURAL_OPERATION",
        name: "Ferme Blajan",
        description: undefined,
        address: ADDRESS,
        owner: { structureType: "company", name: "SAS Owner" },
        tenant: { structureType: "company", name: "Tenant SARL" },
        yearlyExpenses: [{ purpose: "propertyTaxes", amount: 3900, bearer: "owner" }],
        yearlyIncomes: [{ source: "operations", amount: 150000 }],
        agriculturalOperationActivity: "POLYCULTURE_AND_LIVESTOCK",
        soilsDistribution: getSoilsDistributionForAgriculturalOperationActivity(
          30000,
          "POLYCULTURE_AND_LIVESTOCK",
        ),
        isSiteOperated: true,
      },
    ]);
  });
});
