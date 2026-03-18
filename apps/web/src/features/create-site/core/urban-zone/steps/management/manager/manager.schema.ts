import { LOCAL_AUTHORITIES } from "shared";
import z from "zod";

export const managerSchema = z.discriminatedUnion("structureType", [
  z.object({ structureType: z.literal("activity_park_manager") }),
  z.object({
    structureType: z.literal("local_authority"),
    localAuthority: z.enum(LOCAL_AUTHORITIES),
    localAuthorityName: z.string(),
  }),
]);
