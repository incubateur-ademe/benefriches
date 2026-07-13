import z from "zod";

export const revenueBuildingsResaleSchema = z.object({
  buildingsResaleSellingPrice: z.number().optional(),
  buildingsResalePropertyTransferDuties: z.number().optional(),
});
