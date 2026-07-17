import z from "zod";

export const expensesSitePurchaseAmountsSchema = z.object({
  sitePurchaseSellingPrice: z.number().optional(),
  sitePurchasePropertyTransferDuties: z.number().optional(),
});
