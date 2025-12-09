import z from "zod";

import { TRevenue } from "../../financial";

export const financialAssistanceRevenueSourceSchema = z.enum([
  "local_or_regional_authority_participation",
  "public_subsidies",
  "other",
]);
export type FinancialAssistanceRevenue = TRevenue<
  z.infer<typeof financialAssistanceRevenueSourceSchema>
>;
