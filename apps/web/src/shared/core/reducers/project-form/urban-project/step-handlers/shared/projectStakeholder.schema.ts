import z from "zod";

export const projectStakeholderSchema = z.object({
  name: z.string(),
  structureType: z.enum([
    "unknown",
    "company",
    "private_individual",
    "municipality",
    "epci",
    "department",
    "region",
    "local_authority",
  ]),
});
