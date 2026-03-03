import z from "zod";

export const expensesSitePurchaseAmountsSchema = z.object({
  sellingPrice: z.number(),
  propertyTransferDuties: z.number().optional(),
});
