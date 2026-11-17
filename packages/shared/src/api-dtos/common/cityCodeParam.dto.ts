import z from "zod";

export const cityCodeParamSchema = z.string().meta({ example: "38522" });
export type CityCodeParam = z.infer<typeof cityCodeParamSchema>;
