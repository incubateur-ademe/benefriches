import z from "zod";

export const getCityReferenceDataResponseDtoSchema = z.object({
  cityCode: z.string(),
  isRural: z.boolean(),
  population: z.number(),
  landAndRealEstateValues: z.object({
    landWithoutBuildingsMedianPricePerSquareMeters: z.number().optional(),
    propertyValueMedianPricePerSquareMeters: z.number(),
    accuracy: z.enum(["city", "france"]),
  }),
});

export type GetCityReferenceDataResponseDto = z.infer<typeof getCityReferenceDataResponseDtoSchema>;
