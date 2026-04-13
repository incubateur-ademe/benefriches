import z from "zod";

export const renewableEnergyTemplateSchema = z.enum(["PHOTOVOLTAIC_POWER_PLANT"]);

export const renewableEnergyTemplates = renewableEnergyTemplateSchema.options;

export type RenewableEnergyTemplate = z.infer<typeof renewableEnergyTemplateSchema>;
