import { z } from "zod";

export const fricheActivitySchema = z.enum([
  "AGRICULTURE",
  "INDUSTRY",
  "MILITARY",
  "RAILWAY",
  "PORT",
  "HOSPITAL",
  "ADMINISTRATION",
  "BUSINESS",
  "HOUSING",
  "OTHER",
]);

export type FricheActivity = z.infer<typeof fricheActivitySchema>;
