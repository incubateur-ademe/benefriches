import z from "zod";

export const photovoltaicPowerSchema = z.object({
  photovoltaicInstallationElectricalPowerKWc: z.number(),
});
