// Regression oracle for ticket 05 (`.agents/tasks/update-site/issues/05-legacy-flow-introduce-answers-map.md`):
// asserts that the new per-step `answers` map, folded through `deriveSiteDataFromAnswers`, agrees
// with the real `siteData` accumulator after EVERY dispatch of a full agricultural-operation walk
// (covers the OPERATOR / IS_SITE_OPERATED branch, distinct from friche's TENANT branch).
import { Address } from "shared";

import { InMemoryCreateSiteService } from "../../../infrastructure/create-site-service/inMemoryCreateSiteApi";
import { getInitialState } from "../../createSite.reducer";
import { deriveSiteDataFromAnswers } from "../../siteCreationAnswers";
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
import { buildBehaviourNetStore } from "../behaviour-net/testHelpers";

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

describe("Site creation answers-map agreement — agricultural operation", () => {
  it("keeps the derived siteData in agreement with the real accumulator at every step of a full agricultural-operation walk", async () => {
    const createSiteService = new InMemoryCreateSiteService();
    const { store } = buildBehaviourNetStore(createSiteService);

    store.dispatch(siteCreationInitiated({ createMode: "custom" }));

    const { siteData: initialSiteData } = (
      store.getState() as { siteCreation: ReturnType<typeof getInitialState> }
    ).siteCreation;

    const expectAnswersAgreeWithSiteData = () => {
      const { siteCreation } = store.getState() as {
        siteCreation: ReturnType<typeof getInitialState>;
      };
      expect(deriveSiteDataFromAnswers(initialSiteData, siteCreation.answers)).toEqual(
        siteCreation.siteData,
      );
    };

    expectAnswersAgreeWithSiteData();

    store.dispatch(introductionStepCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(isFricheCompleted({ isFriche: false }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(siteNatureCompleted({ nature: "AGRICULTURAL_OPERATION" }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(
      agriculturalOperationActivityCompleted({ activity: "POLYCULTURE_AND_LIVESTOCK" }),
    );
    expectAnswersAgreeWithSiteData();

    store.dispatch(addressStepCompleted({ address: ADDRESS }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(soilsIntroductionStepCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(siteSurfaceAreaStepCompleted({ surfaceArea: 30000 }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(spacesKnowledgeStepCompleted({ knowsSpaces: false }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(soilsCarbonStorageStepCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(managementIntroductionCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(ownerStepCompleted({ owner: { structureType: "company", name: "SAS Owner" } }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(isSiteOperatedStepCompleted({ isSiteOperated: true }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(
      operatorStepCompleted({ tenant: { structureType: "company", name: "Tenant SARL" } }),
    );
    expectAnswersAgreeWithSiteData();

    store.dispatch(yearlyExpensesAndIncomeIntroductionCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(
      yearlyExpensesStepCompleted([{ purpose: "propertyTaxes", amount: 3900, bearer: "owner" }]),
    );
    expectAnswersAgreeWithSiteData();

    store.dispatch(yearlyIncomeStepCompleted([{ source: "operations", amount: 150000 }]));
    expectAnswersAgreeWithSiteData();

    store.dispatch(yearlyExpensesSummaryCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(namingIntroductionStepCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(namingStepCompleted({ name: "Ferme Blajan" }));
    expectAnswersAgreeWithSiteData();

    await store.dispatch(customSiteSaved());
    expectAnswersAgreeWithSiteData();
  });
});
