import z from "zod";

import { projectStakeholderSchema } from "../shared/projectStakeholder.schema";

export const stakeholdersFutureSiteOwnerSchema = z.object({
  futureSiteOwner: projectStakeholderSchema,
});
