import z from "zod";

const communeDataSchema = z.object({
  population: z.number(),
  superficie_m2: z.number(),
  nom: z.string(),
});

export const getFricheInactionCostResponseDtoSchema = z.object({
  cout_annuel_securisation: z.number().optional(),
  cout_annuel_debarras_depot_illegal: z.number(),
  description: z.string(),
  commune_data: communeDataSchema.optional(),
});

export type GetFricheInactionCostDto = z.infer<typeof getFricheInactionCostResponseDtoSchema>;
