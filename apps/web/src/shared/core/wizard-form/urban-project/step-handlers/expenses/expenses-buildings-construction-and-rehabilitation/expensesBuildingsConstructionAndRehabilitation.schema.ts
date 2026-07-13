import z from "zod";

export const expensesBuildingsConstructionAndRehabilitationSchema = z.object({
  technicalStudiesAndFees: z.number().nonnegative().optional(),
  buildingsConstructionWorks: z.number().nonnegative().optional(),
  buildingsRehabilitationWorks: z.number().nonnegative().optional(),
  otherConstructionExpenses: z.number().nonnegative().optional(),
});

/**
 * Maps form field names (camelCase) to API expense purpose strings (snake_case).
 */
export const EXPENSE_FIELD_TO_PURPOSE = {
  technicalStudiesAndFees: "technical_studies_and_fees",
  buildingsConstructionWorks: "buildings_construction_works",
  buildingsRehabilitationWorks: "buildings_rehabilitation_works",
  otherConstructionExpenses: "other_construction_expenses",
} as const;

/**
 * Maps API expense purpose strings (snake_case) to form field names (camelCase).
 * Derived from EXPENSE_FIELD_TO_PURPOSE to keep a single source of truth.
 */
export const EXPENSE_PURPOSE_TO_FIELD = Object.fromEntries(
  Object.entries(EXPENSE_FIELD_TO_PURPOSE).map(([field, purpose]) => [purpose, field]),
) as Record<
  (typeof EXPENSE_FIELD_TO_PURPOSE)[keyof typeof EXPENSE_FIELD_TO_PURPOSE],
  keyof typeof EXPENSE_FIELD_TO_PURPOSE
>;
