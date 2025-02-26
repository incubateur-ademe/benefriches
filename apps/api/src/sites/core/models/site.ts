import { Site } from "shared";
import { z } from "zod";

export const addressSchema = z.object({
  banId: z.string(),
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

export type SiteEntity = Site & {
  createdAt: Date;
  createdBy: string;
  creationMode: "express" | "custom";
};
