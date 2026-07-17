import z from "zod";

export const scheduleProjectionSchema = z.object({
  reinstatementSchedule: z
    .object({
      startDate: z.string(),
      endDate: z.string(),
    })
    .optional(),
  installationSchedule: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }),
  firstYearOfOperation: z.number(),
});
