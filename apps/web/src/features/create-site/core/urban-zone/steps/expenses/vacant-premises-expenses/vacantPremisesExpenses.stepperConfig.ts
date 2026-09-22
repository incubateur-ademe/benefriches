import type { UrbanZoneStepStepperConfig } from "../../../urbanZoneStepperConfig";

export const vacantPremisesExpensesStepperConfig = {
  groupId: "EXPENSES",
  label: "Dépenses locaux vacants",
  subGroupId: "VACANT_PREMISES_EXPENSES",
} as const satisfies UrbanZoneStepStepperConfig;
