import z from "zod";

export const photovoltaicKeyParameterSchema = z.object({
  photovoltaicKeyParameter: z.enum(["POWER", "SURFACE"]),
});
