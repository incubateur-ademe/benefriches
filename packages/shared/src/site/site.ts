import { z } from "zod";

export const siteNatureSchema = z.enum(["FRICHE", "AGRICULTURAL_OPERATION", "NATURAL_AREA"]);
export type SiteNature = z.infer<typeof siteNatureSchema>;

export const addressSchema = z.object({
  banId: z.string().optional(),
  value: z.string(),
  city: z.string(),
  cityCode: z.string(),
  postCode: z.string(),
  streetNumber: z.string().optional(),
  streetName: z.string().optional(),
  long: z.number(),
  lat: z.number(),
});

export type Address = z.infer<typeof addressSchema>;
