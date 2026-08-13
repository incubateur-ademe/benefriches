import z from "zod";

const MAX_SINCE = {
  day: 3650,
  week: 520,
  month: 120,
  year: 50,
} as const;

export const getPeriodicityStatsRequestDtoSchema = z
  .object({
    since: z.coerce.number().int().positive().optional(),
    periodicity: z.enum(["day", "week", "month", "year"]).optional().default("month"),
  })
  .refine((data) => data.since === undefined || data.since <= MAX_SINCE[data.periodicity], {
    message: "since is too large for the given periodicity",
    path: ["since"],
  });

export type GetPeriodicityStatsRequestDto = z.infer<typeof getPeriodicityStatsRequestDtoSchema>;

export const getPeriodicityStatsResponseDtoSchema = z.object({
  description: z.string().optional(),
  stats: z.array(
    z.object({
      value: z.number(),
      date: z.number(),
    }),
  ),
});

export type GetPeriodicityStatsResponseDto = z.infer<typeof getPeriodicityStatsResponseDtoSchema>;
