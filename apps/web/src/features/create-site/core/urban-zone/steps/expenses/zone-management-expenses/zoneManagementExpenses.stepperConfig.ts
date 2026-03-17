import type { UrbanZoneStepStepperConfig } from "../../../step-handlers/urbanZoneStepperConfig";

export const zoneManagementExpensesStepperConfig = {
  groupId: "EXPENSES",
  label: "Dépenses gestion zone",
} as const satisfies UrbanZoneStepStepperConfig;
