import { initCurrentUser } from "@/features/onboarding/core/initCurrentUser.action";

import { customUrbanProjectSaved } from "../actions/customUrbanProjectSaved.action";
import { UrbanProjectCreationData } from "../creationData";
import { StoreBuilder } from "./testUtils";

const mock = {
  name: "Mon projet urbain",
  description: "Test",
  spacesCategoriesDistribution: {
    LIVING_AND_ACTIVITY_SPACES: 1500,
    URBAN_POND_OR_LAKE: 500,
  },
  greenSpacesDistribution: {
    URBAN_POND_OR_LAKE: 500,
    LAWNS_AND_BUSHES: 100,
  },
  livingAndActivitySpacesDistribution: {
    BUILDINGS: 250,
    IMPERMEABLE_SURFACE: 250,
    PERMEABLE_SURFACE: 250,
  },
  publicSpacesDistribution: {
    IMPERMEABLE_SURFACE: 1000,
    PERMEABLE_SURFACE: 500,
  },
  decontaminatedSurfaceArea: 3000,
  buildingsUsesDistribution: {
    RESIDENTIAL: 250,
    LOCAL_STORE: 250,
    ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 250,
    MULTI_STORY_PARKING: 250,
  },
  // stakeholders
  projectDeveloper: {
    name: "developer company name",
    structureType: "company",
  },
  reinstatementContractOwner: {
    name: "Reinstatement company",
    structureType: "company",
  },
  // site purchase
  sitePurchaseSellingPrice: 150000,
  sitePurchasePropertyTransferDuties: 12000,
  siteResaleExpectedPropertyTransferDuties: 20000,
  siteResaleExpectedSellingPrice: 2000000,
  // expenses
  reinstatementExpenses: [
    { amount: 120000, purpose: "waste_collection" },
    { amount: 33333, purpose: "deimpermeabilization" },
    { amount: 44444, purpose: "sustainable_soils_reinstatement" },
    { amount: 1, purpose: "other_reinstatement" },
  ],
  installationExpenses: [
    { amount: 130000, purpose: "development_works" },
    { amount: 59999, purpose: "technical_studies" },
  ],
  yearlyProjectedBuildingsOperationsExpenses: [{ purpose: "maintenance", amount: 12000 }],
  // revenues
  yearlyProjectedRevenues: [{ source: "rent", amount: 13000 }],
  financialAssistanceRevenues: [
    { amount: 14000, source: "public_subsidies" },
    { amount: 999.99, source: "other" },
  ],
  // schedules
  reinstatementSchedule: {
    startDate: new Date("2025-02-01").toISOString(),
    endDate: new Date("2028-06-30").toISOString(),
  },
  installationSchedule: {
    startDate: new Date("2028-07-01").toISOString(),
    endDate: new Date("2029-03-01").toISOString(),
  },
  firstYearOfOperation: 2025,
  // project phase
  projectPhase: "construction",
} as const satisfies UrbanProjectCreationData;

describe("Urban project creation : customUrbanProjectSaved action", () => {
  it("results as success with all creationData completed", async () => {
    const store = new StoreBuilder()
      .withStepsHistory(["URBAN_PROJECT_FINAL_SUMMARY"])
      .withSiteData({ id: "f590f643-cd9a-4187-8973-f90e9f1998c8" })
      .withCreationData(mock)
      .build();

    await store.dispatch(initCurrentUser());

    await store.dispatch(customUrbanProjectSaved());

    const newState = store.getState();

    expect(newState.projectCreation.urbanProject.saveState).toEqual("success");
    expect([...newState.projectCreation.stepsHistory].pop()).toEqual(
      "URBAN_PROJECT_CREATION_RESULT",
    );
  });

  it("results as error if creationData are empty", async () => {
    const store = new StoreBuilder().withStepsHistory(["URBAN_PROJECT_FINAL_SUMMARY"]).build();

    await store.dispatch(customUrbanProjectSaved());

    const newState = store.getState();
    expect(newState.projectCreation.urbanProject.saveState).toEqual("error");
    expect([...newState.projectCreation.stepsHistory].pop()).toEqual(
      "URBAN_PROJECT_CREATION_RESULT",
    );
  });
});
