import { z } from "zod";

// The named human contact shown in the reminder emails (signature + mailto button). Held in
// configuration (LIFECYCLE_EMAILS_CONTACT_*), never in template code, so it can change
// with the person's role without a deploy. First and last names are separate because the
// button uses the first name alone ("Contacter <prénom> de Bénéfriches"), and splitting a
// full name on whitespace breaks compound first names.
export const lifecycleEmailContactSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  role: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  email: z.email(),
});

export type LifecycleEmailContact = z.infer<typeof lifecycleEmailContactSchema>;
