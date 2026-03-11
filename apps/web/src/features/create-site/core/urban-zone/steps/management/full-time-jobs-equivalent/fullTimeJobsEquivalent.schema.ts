import z from "zod";

export const fullTimeJobsEquivalentSchema = z.object({
  fullTimeJobs: z.number().nonnegative(),
});
