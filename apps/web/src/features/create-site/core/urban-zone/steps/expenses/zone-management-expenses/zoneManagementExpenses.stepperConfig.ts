import type { UrbanZoneStepStepperConfig } from "../../../urbanZoneStepperConfig";

export const zoneManagementExpensesStepperConfig = {
  groupId: "EXPENSES",
  label: "Dépenses gestion zone",
  subGroupId: "ZONE_MANAGEMENT_EXPENSES",
} as const satisfies UrbanZoneStepStepperConfig;
