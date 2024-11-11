import {
  FinancialAssistanceRevenue,
  InstallationExpense,
  ProjectPhase,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
} from "shared";

import { ProjectStakeholder } from "@/features/create-project/domain/project.types";
import { initCurrentUser } from "@/features/users/application/initCurrentUser.action";

import { saveReconversionProject } from "../saveReconversionProject.action";
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
    PAVED_ALLEY_OR_PARKING_LOT: 250,
    GRAVEL_ALLEY_OR_PARKING_LOT: 250,
  },
  publicSpacesDistribution: {
    IMPERMEABLE_SURFACE: 1000,
    PERMEABLE_SURFACE: 500,
  },
  decontaminatedSurfaceArea: 3000,
  buildingsUsesDistribution: {
    RESIDENTIAL: 250,
    GROUND_FLOOR_RETAIL: 250,
    SHIPPING_OR_INDUSTRIAL_BUILDINGS: 250,
    MULTI_STORY_PARKING: 250,
  },
  // stakeholders
  projectDeveloper: {
    name: "developer company name",
    structureType: "company",
  } as ProjectStakeholder,
  reinstatementContractOwner: {
    name: "Reinstatement company",
    structureType: "company",
  } as ProjectStakeholder,
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
    { amount: 1, purpose: "other_reinstatement_costs" },
  ] as ReinstatementExpense[],
  installationExpenses: [
    { amount: 130000, purpose: "development_works" },
    { amount: 59999, purpose: "technical_studies" },
  ] as InstallationExpense[],
  yearlyProjectedExpenses: [{ purpose: "rent", amount: 12000 }] as RecurringExpense[],
  // revenues
  yearlyProjectedRevenues: [{ source: "operations", amount: 13000 }] as RecurringRevenue[],
  financialAssistanceRevenues: [
    { amount: 14000, source: "public_subsidies" },
    { amount: 999.99, source: "other" },
  ] as FinancialAssistanceRevenue[],
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
  projectPhase: "construction" as ProjectPhase,
};

describe("Urban project creation : saveReconversionProject action", () => {
  it("results as success with all creationData completed", async () => {
    const store = new StoreBuilder()
      .withStepsHistory(["FINAL_SUMMARY"])
      .withSiteData({ id: "f590f643-cd9a-4187-8973-f90e9f1998c8" })
      .withCreationData(mock)
      .build();

    await store.dispatch(initCurrentUser());

    await store.dispatch(saveReconversionProject());

    const newState = store.getState();

    expect(newState.projectCreation.urbanProject.saveState).toEqual("success");
    expect([...newState.projectCreation.urbanProject.stepsHistory].pop()).toEqual(
      "CREATION_RESULT",
    );
  });

  it("results as error if creationData are empty", async () => {
    const store = new StoreBuilder().withStepsHistory(["FINAL_SUMMARY"]).build();

    await store.dispatch(saveReconversionProject());

    const newState = store.getState();
    expect(newState.projectCreation.urbanProject.saveState).toEqual("error");
    expect([...newState.projectCreation.urbanProject.stepsHistory].pop()).toEqual(
      "CREATION_RESULT",
    );
  });
});
