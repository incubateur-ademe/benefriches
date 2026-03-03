import z from "zod";

export const scheduleProjectionSchema = z.object({
  firstYearOfOperation: z.number().optional(),
  photovoltaicInstallationSchedule: z
    .object({ startDate: z.string(), endDate: z.string() })
    .optional(),
  reinstatementSchedule: z.object({ startDate: z.string(), endDate: z.string() }).optional(),
});
