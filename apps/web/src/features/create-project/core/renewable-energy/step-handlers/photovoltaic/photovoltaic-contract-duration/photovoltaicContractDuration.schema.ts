import z from "zod";

export const photovoltaicContractDurationSchema = z.object({
  photovoltaicContractDuration: z.number(),
});
