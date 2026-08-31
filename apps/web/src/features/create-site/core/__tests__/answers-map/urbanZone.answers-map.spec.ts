// Regression oracle for ticket 05 (`.agents/tasks/update-site/issues/05-legacy-flow-introduce-answers-map.md`):
// asserts that the new per-step `answers` map, folded through `deriveSiteDataFromAnswers`, agrees
// with the real `siteData` accumulator through the urban-zone nature's legacy hand-off steps
// (SITE_NATURE -> URBAN_ZONE_TYPE -> ADDRESS -> URBAN_ZONE_LAND_PARCELS_INTRODUCTION -> SURFACE_AREA).
// Stops right where control passes to the already-ported urban-zone step-handler engine (ticket 04),
// which already has its own answers map and is out of scope here.
import { Address } from "shared";

import { InMemoryCreateSiteService } from "../../../infrastructure/create-site-service/inMemoryCreateSiteApi";
import { getInitialState } from "../../createSite.reducer";
import { deriveSiteDataFromAnswers } from "../../siteCreationAnswers";
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

describe("Site creation answers-map agreement — urban zone (legacy hand-off)", () => {
  it("keeps the derived siteData in agreement with the real accumulator through the urban-zone hand-off steps", () => {
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

    store.dispatch(siteNatureCompleted({ nature: "URBAN_ZONE" }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(urbanZoneTypeCompleted({ urbanZoneType: "ECONOMIC_ACTIVITY_ZONE" }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(addressStepCompleted({ address: ADDRESS }));
    expectAnswersAgreeWithSiteData();

    store.dispatch(urbanZoneLandParcelsIntroductionCompleted());
    expectAnswersAgreeWithSiteData();

    store.dispatch(siteSurfaceAreaStepCompleted({ surfaceArea: 7000 }));
    expectAnswersAgreeWithSiteData();
  });
});
