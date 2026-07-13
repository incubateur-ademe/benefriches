import z from "zod";

import { projectStakeholderSchema } from "../../shared/projectStakeholder.schema";

export const stakeholdersReinstatementContractOwnerSchema = z.object({
  reinstatementContractOwner: projectStakeholderSchema,
});
