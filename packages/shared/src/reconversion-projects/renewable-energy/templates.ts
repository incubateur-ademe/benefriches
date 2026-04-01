import z from "zod";

export const renewableEnergyTemplateSchema = z.enum(["PHOTOVOLTAIC_POWER_PLANT"]);

export type RenewableEnergyTemplate = z.infer<typeof renewableEnergyTemplateSchema>;
