import z from "zod";

export const buildingsUse = z.enum([
  "RESIDENTIAL",
  "ECONOMIC_ACTIVITY",
  "MULTI_STORY_PARKING",
  "OTHER",
]);

export type BuildingsUse = z.infer<typeof buildingsUse>;
