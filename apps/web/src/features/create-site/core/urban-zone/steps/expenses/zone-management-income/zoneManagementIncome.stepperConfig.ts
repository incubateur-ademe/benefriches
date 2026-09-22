import type { UrbanZoneStepStepperConfig } from "../../../urbanZoneStepperConfig";

export const zoneManagementIncomeStepperConfig = {
  groupId: "EXPENSES",
  label: "Recettes gestion zone",
  subGroupId: "ZONE_MANAGEMENT_INCOME",
} as const satisfies UrbanZoneStepStepperConfig;
