import { Address, getSoilsDistributionForNaturalAreaType } from "shared";

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

describe("Site creation behaviour net — natural area", () => {
  it("walks a fully-answered natural-area wizard, asserting the current step at each branch and the exact submitted payload", async () => {
    const createSiteService = new InMemoryCreateSiteService();
    const { store, user } = buildBehaviourNetStore(createSiteService);

    store.dispatch(siteCreationInitiated({ createMode: "custom" }));
    store.dispatch(introductionStepCompleted());

    store.dispatch(isFricheCompleted({ isFriche: false }));
    expect(currentStep(store)).toEqual("SITE_NATURE");

    store.dispatch(siteNatureCompleted({ nature: "NATURAL_AREA" }));
    expect(currentStep(store)).toEqual("NATURAL_AREA_TYPE");

    store.dispatch(naturalAreaTypeCompleted({ naturalAreaType: "FOREST" }));
    expect(currentStep(store)).toEqual("ADDRESS");

    store.dispatch(addressStepCompleted({ address: ADDRESS }));
    expect(currentStep(store)).toEqual("SPACES_INTRODUCTION");

    store.dispatch(soilsIntroductionStepCompleted());
    expect(currentStep(store)).toEqual("SURFACE_AREA");

    store.dispatch(siteSurfaceAreaStepCompleted({ surfaceArea: 40000 }));
    expect(currentStep(store)).toEqual("SPACES_KNOWLEDGE");

    store.dispatch(spacesKnowledgeStepCompleted({ knowsSpaces: false }));
    expect(currentStep(store)).toEqual("SOILS_SUMMARY");

    store.dispatch(soilsCarbonStorageStepCompleted());
    expect(currentStep(store)).toEqual("MANAGEMENT_INTRODUCTION");

    store.dispatch(managementIntroductionCompleted());
    expect(currentStep(store)).toEqual("OWNER");

    store.dispatch(
      ownerStepCompleted({ owner: { structureType: "municipality", name: "Commune de Blajan" } }),
    );
    // branch: nature NATURAL_AREA -> straight to naming, no leased/operated question,
    // no yearly-finances section
    expect(currentStep(store)).toEqual("NAMING_INTRODUCTION");

    store.dispatch(namingIntroductionStepCompleted());
    expect(currentStep(store)).toEqual("NAMING");

    store.dispatch(namingStepCompleted({ name: "Forêt de Blajan" }));
    expect(currentStep(store)).toEqual("FINAL_SUMMARY");

    await store.dispatch(customSiteSaved());

    expect(currentStep(store)).toEqual("CREATION_RESULT");
    expect(saveLoadingState(store)).toEqual("success");
    expect(createSiteService._customSites).toEqual([
      {
        id: siteId(store),
        createdBy: user.id,
        nature: "NATURAL_AREA",
        name: "Forêt de Blajan",
        description: undefined,
        address: ADDRESS,
        owner: { structureType: "municipality", name: "Commune de Blajan" },
        tenant: undefined,
        yearlyExpenses: [],
        yearlyIncomes: [],
        naturalAreaType: "FOREST",
        soilsDistribution: getSoilsDistributionForNaturalAreaType(40000, "FOREST"),
      },
    ]);
  });
});
