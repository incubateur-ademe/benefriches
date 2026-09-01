import { useId } from "react";
import type { SiteNotEditableReason } from "shared";

import { routes } from "@/app/router";
import MenuItemButton from "@/shared/views/components/Menu/MenuItemButton";

import { SITE_NOT_EDITABLE_REASON_LABEL } from "./siteNotEditableReasonLabels";

type Props = {
  siteId: string;
  isEditable: boolean;
  notEditableReason: SiteNotEditableReason | null;
  from: "site" | "evaluations";
};

/**
 * Single shared "Modifier le site" menu action, used both on the site page header
 * and on each "Mes évaluations" row, so wording and behaviour cannot drift apart.
 *
 * This component renders exactly what it is given: eligibility comes from the
 * server (`isEditable` / `notEditableReason`), never re-derived client-side.
 *
 * When the site cannot be modified, the action stays visible and focusable rather
 * than disappearing or using the HTML `disabled` attribute: the native `disabled`
 * attribute (and Headless UI's `MenuItem disabled` prop) removes the item from
 * keyboard roving focus, which would make it unreachable by keyboard. We instead
 * use `aria-disabled` (which keeps it focusable and announces the state) with an
 * inert click handler, and render the reason as real, always-visible DOM text
 * (never a hover-only tooltip) so it reaches assistive technology too.
 */
function UpdateSiteMenuItem({ siteId, isEditable, notEditableReason, from }: Props) {
  const reasonId = useId();

  if (isEditable) {
    return (
      <MenuItemButton
        iconId="fr-icon-edit-line"
        linkProps={routes.updateSite({ siteId, from }).link}
      >
        Modifier le site
      </MenuItemButton>
    );
  }

  return (
    <MenuItemButton
      iconId="fr-icon-edit-line"
      className="opacity-50"
      nativeButtonProps={{
        "aria-disabled": true,
        "aria-describedby": reasonId,
      }}
      onClick={(event) => {
        event.preventDefault();
      }}
    >
      Modifier le site
      {notEditableReason && (
        <span id={reasonId} className="block text-xs font-normal text-text-mention-grey">
          {SITE_NOT_EDITABLE_REASON_LABEL[notEditableReason]}
        </span>
      )}
    </MenuItemButton>
  );
}

export default UpdateSiteMenuItem;
