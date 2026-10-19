import { z } from "zod";

// email is only checked to be a string: the use case answers UserDoesNotExist for any address
// that matches no user, and a stricter format check would turn that answer into a 400.
export const sendAuthLinkRequestDtoSchema = z.object({
  email: z.string(),
  postLoginRedirectTo: z.string().optional(),
});

export type SendAuthLinkRequestDto = z.infer<typeof sendAuthLinkRequestDtoSchema>;
