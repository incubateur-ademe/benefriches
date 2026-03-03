import z from "zod";

export const stakeholdersSitePurchaseSchema = z.object({
  willSiteBePurchased: z.boolean(),
});
