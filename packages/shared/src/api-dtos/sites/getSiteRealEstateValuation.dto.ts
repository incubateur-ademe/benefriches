import z from "zod";

export const getSiteRealEstateValuationResponseDtoSchema = z.object({
  sellingPrice: z.number(),
  propertyTransferDuties: z.number(),
});

export type GetSiteRealEstateValuationResponseDto = z.infer<
  typeof getSiteRealEstateValuationResponseDtoSchema
>;
