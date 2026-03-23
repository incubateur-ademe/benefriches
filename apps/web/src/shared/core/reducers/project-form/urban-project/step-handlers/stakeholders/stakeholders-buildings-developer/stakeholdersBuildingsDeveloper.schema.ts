import z from "zod";

export const stakeholdersBuildingsDeveloperSchema = z.object({
  developerWillBeBuildingsConstructor: z.boolean(),
});
