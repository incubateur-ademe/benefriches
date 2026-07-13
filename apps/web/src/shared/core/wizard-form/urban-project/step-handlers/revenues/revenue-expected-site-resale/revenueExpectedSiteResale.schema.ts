import z from "zod";

export const revenueExpectedSiteResaleSchema = z.object({
  siteResaleExpectedSellingPrice: z.number().optional(),
  siteResaleExpectedPropertyTransferDuties: z.number().optional(),
});
