import { z } from "zod";

export const unsubscribeFromLifecycleEmailsRequestDtoSchema = z.object({
  token: z.string().min(1),
});

export type UnsubscribeFromLifecycleEmailsRequestDto = z.infer<
  typeof unsubscribeFromLifecycleEmailsRequestDtoSchema
>;

export const unsubscribeFromLifecycleEmailsErrorCodeSchema = z.enum(["INVALID_UNSUBSCRIBE_TOKEN"]);

export type UnsubscribeFromLifecycleEmailsErrorCode = z.infer<
  typeof unsubscribeFromLifecycleEmailsErrorCodeSchema
>;
