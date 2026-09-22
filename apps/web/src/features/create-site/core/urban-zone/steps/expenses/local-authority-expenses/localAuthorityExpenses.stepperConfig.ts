import type { UrbanZoneStepStepperConfig } from "../../../urbanZoneStepperConfig";

export const localAuthorityExpensesStepperConfig = {
  groupId: "EXPENSES",
  label: "Dépenses collectivité",
  subGroupId: "LOCAL_AUTHORITY_EXPENSES",
} as const satisfies UrbanZoneStepStepperConfig;
