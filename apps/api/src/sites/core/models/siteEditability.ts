import type { SiteCreationMode, SiteNotEditableReason } from "shared";

export type SiteEditability =
  | { isEditable: true; notEditableReason: null }
  | { isEditable: false; notEditableReason: SiteNotEditableReason };

export function getSiteEditability(
  site: {
    createdBy: string;
    creationMode: SiteCreationMode;
    hasActiveReconversionProject: boolean;
  },
  requesterId: string,
): SiteEditability {
  if (site.createdBy !== requesterId) {
    return { isEditable: false, notEditableReason: "NOT_CREATOR" };
  }

  if (site.creationMode !== "custom") {
    return { isEditable: false, notEditableReason: "NOT_CUSTOM" };
  }

  if (site.hasActiveReconversionProject) {
    return { isEditable: false, notEditableReason: "ACTIVE_RECONVERSION_PROJECT" };
  }

  return { isEditable: true, notEditableReason: null };
}
