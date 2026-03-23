import z from "zod";

export const expensesBuildingsConstructionAndRehabilitationSchema = z.object({
  technicalStudiesAndFees: z.number().nonnegative().optional(),
  buildingsConstructionWorks: z.number().nonnegative().optional(),
  buildingsRehabilitationWorks: z.number().nonnegative().optional(),
  otherConstructionExpenses: z.number().nonnegative().optional(),
});
