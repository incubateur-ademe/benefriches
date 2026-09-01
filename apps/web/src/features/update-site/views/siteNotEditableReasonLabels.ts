import type { SiteNotEditableReason } from "shared";

// Single source of truth for the wording shown when a site cannot be modified.
// Used both by the update wizard's blocking screen and by the "Modifier le site"
// menu action, so the two can never drift apart.
export const SITE_NOT_EDITABLE_REASON_LABEL: Record<SiteNotEditableReason, string> = {
  NOT_CREATOR: "Seul le créateur de ce site peut le modifier.",
  NOT_CUSTOM: "Ce site n'a pas été créé manuellement et ne peut pas être modifié ici.",
  ACTIVE_RECONVERSION_PROJECT:
    "Ce site est utilisé par un ou plusieurs projets de reconversion. Supprimez ces projets pour pouvoir modifier le site.",
};
