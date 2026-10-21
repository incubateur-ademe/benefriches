import type { FrIconClassName, RiIconClassName } from "@codegouvfr/react-dsfr";
import type { Link } from "type-route";

import { routes } from "@/app/router";

export const CURRENT_HEADER_ITEM_CLASSES = "bg-blue-ultralight text-blue-ultradark";

export const ABOUT_IMPACTS_DIALOG_ID = "fr-dialog-about-impacts-header";

type HeaderItemIconId = FrIconClassName | RiIconClassName;

export type HeaderLinkItem = {
  iconId: HeaderItemIconId;
  text: string;
  linkProps: Link | { href: string };
  isCurrent?: boolean;
};

export type HeaderDialogItem = {
  iconId: HeaderItemIconId;
  text: string;
  nativeButtonProps: { "aria-controls": string; "data-fr-opened": false };
};

export const LOGIN_HEADER_ITEM = {
  iconId: "fr-icon-logout-box-r-line",
  text: "Accéder à Bénéfriches",
  linkProps: routes.accessBenefriches().link,
} as const satisfies HeaderLinkItem;

export const LOGOUT_HEADER_ITEM = {
  iconId: "fr-icon-logout-box-r-line",
  text: "Se déconnecter",
  linkProps: { href: "/api/auth/logout" },
} as const satisfies HeaderLinkItem;

export const FAQ_HEADER_ITEM = {
  iconId: "fr-icon-questionnaire-line",
  text: "Questions fréquentes",
  nativeButtonProps: {
    "aria-controls": ABOUT_IMPACTS_DIALOG_ID,
    "data-fr-opened": false,
  },
} as const satisfies HeaderDialogItem;

type BuildNavigationHeaderItemsInput = {
  isAdmin: boolean;
  myEvaluationsLink: Link;
  isMyEvaluationsCurrent: boolean;
};

// Navigation links shown to a logged-in user, in display order, shared by every app header
export function buildNavigationHeaderItems({
  isAdmin,
  myEvaluationsLink,
  isMyEvaluationsCurrent,
}: BuildNavigationHeaderItemsInput): HeaderLinkItem[] {
  return [
    {
      iconId: "fr-icon-bar-chart-box-line",
      text: "Mes évaluations",
      linkProps: myEvaluationsLink,
      isCurrent: isMyEvaluationsCurrent,
    },
    ...(isAdmin
      ? [
          {
            iconId: "fr-icon-settings-5-line",
            text: "Administration",
            linkProps: routes.admin().link,
          } satisfies HeaderLinkItem,
        ]
      : []),
  ];
}
