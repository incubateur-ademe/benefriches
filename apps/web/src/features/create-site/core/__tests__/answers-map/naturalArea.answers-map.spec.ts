// Regression oracle for ticket 05 (`.agents/tasks/update-site/issues/05-legacy-flow-introduce-answers-map.md`):
// asserts that the new per-step `answers` map, folded through `deriveSiteDataFromAnswers`, agrees
// with the real `siteData` accumulator after EVERY dispatch of a full natural-area walk
// (covers the NATURAL_AREA branch, which skips leased/operated and yearly-finances entirely).
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
import { naturalAreaTypeCompleted } from "../../steps/site-activity/siteActivity.actions";
import {
  managementIntroductionCompleted,
  ownerStepCompleted,
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

describe("Site creation answers-map agreement — natural area", () => {
  it("keeps the derived siteData in agreement with the real accumulator at every step of a full natural-area walk", async () => {
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

    store.dispatch(siteNatureCompleted({ nature: "NATURAL_AREA" }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(naturalAreaTypeCompleted({ naturalAreaType: "FOREST" }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(addressStepCompleted({ address: ADDRESS }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(soilsIntroductionStepCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(siteSurfaceAreaStepCompleted({ surfaceArea: 40000 }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(spacesKnowledgeStepCompleted({ knowsSpaces: false }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(soilsCarbonStorageStepCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(managementIntroductionCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(
      ownerStepCompleted({ owner: { structureType: "municipality", name: "Commune de Blajan" } }),
    );
    expectAnswersAgreeWithSiteData();

    store.dispatch(namingIntroductionStepCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(namingStepCompleted({ name: "Forêt de Blajan" }));
    expectAnswersAgreeWithSiteData();

    await store.dispatch(customSiteSaved());
    expectAnswersAgreeWithSiteData();
  });
});
