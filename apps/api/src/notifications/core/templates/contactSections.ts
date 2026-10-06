import type { LifecycleEmailContact } from "src/notifications/core/models/lifecycleEmailContact";
import type { EmailSection } from "src/notifications/core/templates/emailLayout";

// The contact offer shared by the reminder emails: a secondary button opening a mail
// composer, then the signature. Every value comes from configuration.
export function buildContactSections(contact: LifecycleEmailContact): EmailSection[] {
  return [
    {
      type: "button",
      variant: "secondary",
      label: `Contacter ${contact.firstName} de Bénéfriches`,
      url: `mailto:${contact.email}`,
    },
    {
      type: "contactSignature",
      name: `${contact.firstName} ${contact.lastName}`,
      role: contact.role,
      organisation: "Bénéfriches",
      phone: contact.phone,
      email: contact.email,
    },
  ];
}
