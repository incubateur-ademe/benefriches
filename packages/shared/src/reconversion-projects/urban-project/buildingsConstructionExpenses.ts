import z from "zod";

import { TExpense } from "../../financial";

export const buildingsConstructionExpensePurposeSchema = z.enum([
  "technical_studies_and_fees",
  "buildings_construction_works",
  "buildings_rehabilitation_works",
  "other_construction_expenses",
]);

export type BuildingsConstructionExpensePurpose = z.infer<
  typeof buildingsConstructionExpensePurposeSchema
>;

export type BuildingsConstructionExpense = TExpense<BuildingsConstructionExpensePurpose>;
