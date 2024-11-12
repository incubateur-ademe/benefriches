import z from "zod";

import { buildingsUseSchema } from "../urbanProject";

export const isBuildingUse = (value: unknown): value is BuildingsUse => {
  return buildingsUseSchema.safeParse(value).success;
};

export type BuildingsUse = z.infer<typeof buildingsUseSchema>;

export const buildingsUseSurfaceAreaDistributionSchema = z.record(
  buildingsUseSchema,
  z.number().nonnegative(),
);
export type BuildingsUseSurfaceAreaDistribution = z.infer<
  typeof buildingsUseSurfaceAreaDistributionSchema
>;
