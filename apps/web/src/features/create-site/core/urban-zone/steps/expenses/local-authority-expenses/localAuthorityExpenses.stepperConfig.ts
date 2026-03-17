import type { UrbanZoneStepStepperConfig } from "../../../step-handlers/urbanZoneStepperConfig";

export const localAuthorityExpensesStepperConfig = {
  groupId: "EXPENSES",
  label: "Dépenses collectivité",
} as const satisfies UrbanZoneStepStepperConfig;
