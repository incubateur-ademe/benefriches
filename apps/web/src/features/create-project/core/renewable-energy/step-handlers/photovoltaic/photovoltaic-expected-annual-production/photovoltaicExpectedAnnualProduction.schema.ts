import z from "zod";

export const photovoltaicExpectedAnnualProductionSchema = z.object({
  photovoltaicExpectedAnnualProduction: z.number(),
});
