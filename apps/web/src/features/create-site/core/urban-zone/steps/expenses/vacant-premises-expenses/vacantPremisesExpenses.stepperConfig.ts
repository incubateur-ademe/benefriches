import type { UrbanZoneStepStepperConfig } from "../../../step-handlers/urbanZoneStepperConfig";

export const vacantPremisesExpensesStepperConfig = {
  groupId: "EXPENSES",
  label: "Dépenses locaux vacants",
} as const satisfies UrbanZoneStepStepperConfig;
