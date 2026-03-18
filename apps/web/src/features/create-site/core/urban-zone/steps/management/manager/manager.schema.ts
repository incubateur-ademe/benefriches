import { LOCAL_AUTHORITIES } from "shared";
import z from "zod";

export const managerSchema = z.object({
  structureType: z.enum(["activity_park_manager", "local_authority"]),
  name: z.string().optional(),
  localAuthority: z.enum(LOCAL_AUTHORITIES).optional(),
});
