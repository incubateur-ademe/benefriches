import z from "zod";

// Request: the INSEE code of the commune to look up.
export const getCityRuralityRequestDtoSchema = z.object({
  cityCode: z.string(),
});

export type GetCityRuralityRequestDto = z.infer<typeof getCityRuralityRequestDtoSchema>;

// Response: whether the commune is rural according to the official
// "France Ruralités Revitalisation" (FRR) list.
export const getCityRuralityResponseDtoSchema = z.object({
  cityCode: z.string(),
  isRural: z.boolean(),
});

export type GetCityRuralityResponseDto = z.infer<typeof getCityRuralityResponseDtoSchema>;
