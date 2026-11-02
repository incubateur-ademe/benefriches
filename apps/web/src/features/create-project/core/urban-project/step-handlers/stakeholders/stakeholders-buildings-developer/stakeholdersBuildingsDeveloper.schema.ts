import z from "zod";

export const stakeholdersBuildingsDeveloperSchema = z
  .object({
    developerWillBeBuildingsConstructor: z.boolean(),
    buildingsResalePlannedAfterDevelopment: z.boolean().optional(),
  })
  .refine(
    ({ developerWillBeBuildingsConstructor, buildingsResalePlannedAfterDevelopment }) =>
      !developerWillBeBuildingsConstructor || buildingsResalePlannedAfterDevelopment !== undefined,
    { path: ["buildingsResalePlannedAfterDevelopment"] },
  );
