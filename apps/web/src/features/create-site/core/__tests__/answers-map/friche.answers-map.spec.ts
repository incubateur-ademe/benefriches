// Regression oracle for ticket 05 (`.agents/tasks/update-site/issues/05-legacy-flow-introduce-answers-map.md`):
// asserts that the new per-step `answers` map, folded through `deriveSiteDataFromAnswers`, agrees
// with the real `siteData` accumulator after EVERY dispatch of a full friche walk. Unlike the
// behaviour-net suite, this test legitimately reads `siteCreation.answers` / `siteCreation.siteData`
// directly, since that internal shape IS the invariant under test.
import { Address } from "shared";

import { InMemoryCreateSiteService } from "../../../infrastructure/create-site-service/inMemoryCreateSiteApi";
import { getInitialState } from "../../createSite.reducer";
import { deriveSiteDataFromAnswers } from "../../siteCreationAnswers";
import { addressStepCompleted } from "../../steps/address/address.actions";
import {
  fricheAccidentsIntroductionStepCompleted,
  fricheAccidentsStepCompleted,
  soilsContaminationIntroductionStepCompleted,
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

describe("Site creation answers-map agreement — friche", () => {
  it("keeps the derived siteData in agreement with the real accumulator at every step of a full friche walk", async () => {
    const createSiteService = new InMemoryCreateSiteService();
    const { store } = buildBehaviourNetStore(createSiteService);

    store.dispatch(siteCreationInitiated({ createMode: "custom" }));

    // Captured once right after siteCreationInitiated, whose handler generates the site's uuid —
    // reused as the derivation's base so the `id` field (never present in any answers delta)
    // agrees with the real accumulator across the whole walk.
    const { siteData: initialSiteData } = (
      store.getState() as { siteCreation: ReturnType<typeof getInitialState> }
    ).siteCreation;

    /** Asserts that the derived siteData (from `answers`) equals the real `siteData` accumulator. */
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

    store.dispatch(isFricheCompleted({ isFriche: true }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(mutabilityOrImpactsSelectionCompleted({ useMutability: false }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(fricheActivityStepCompleted("INDUSTRY"));
    expectAnswersAgreeWithSiteData();

    store.dispatch(addressStepCompleted({ address: ADDRESS }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(soilsIntroductionStepCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(siteSurfaceAreaStepCompleted({ surfaceArea: 30000 }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(spacesKnowledgeStepCompleted({ knowsSpaces: true }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(soilsSelectionStepCompleted({ soils: ["BUILDINGS", "MINERAL_SOIL"] }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(spacesSurfaceAreaDistributionKnowledgeCompleted({ knowsSurfaceAreas: true }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(
      soilsDistributionStepCompleted({
        distribution: { BUILDINGS: 20000, MINERAL_SOIL: 10000 },
      }),
    );
    expectAnswersAgreeWithSiteData();

    store.dispatch(soilsSummaryStepCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(soilsCarbonStorageStepCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(soilsContaminationIntroductionStepCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(
      soilsContaminationStepCompleted({
        hasContaminatedSoils: true,
        contaminatedSoilSurface: 2300,
      }),
    );
    expectAnswersAgreeWithSiteData();

    store.dispatch(fricheAccidentsIntroductionStepCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(
      fricheAccidentsStepCompleted({
        hasRecentAccidents: true,
        accidentsMinorInjuries: 2,
        accidentsSevereInjuries: 1,
        accidentsDeaths: 0,
      }),
    );
    expectAnswersAgreeWithSiteData();

    store.dispatch(managementIntroductionCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(ownerStepCompleted({ owner: { structureType: "company", name: "SAS Owner" } }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(isFricheLeasedStepCompleted({ isFricheLeased: true }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(
      tenantStepCompleted({ tenant: { structureType: "company", name: "Tenant SARL" } }),
    );
    expectAnswersAgreeWithSiteData();

    store.dispatch(yearlyExpensesAndIncomeIntroductionCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(
      yearlyExpensesStepCompleted([{ purpose: "propertyTaxes", amount: 3900, bearer: "owner" }]),
    );
    expectAnswersAgreeWithSiteData();

    store.dispatch(yearlyExpensesSummaryCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(namingIntroductionStepCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(
      namingStepCompleted({ name: "Friche Blajan", description: "Description of the friche" }),
    );
    expectAnswersAgreeWithSiteData();

    await store.dispatch(customSiteSaved());
    expectAnswersAgreeWithSiteData();
  });
});
