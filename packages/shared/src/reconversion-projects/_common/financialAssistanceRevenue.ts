import { TRevenue } from "../../financial";

export type FinancialAssistanceRevenue = TRevenue<
  "local_or_regional_authority_participation" | "public_subsidies" | "other"
>;
