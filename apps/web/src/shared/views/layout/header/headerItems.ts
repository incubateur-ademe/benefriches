import type { FrIconClassName, RiIconClassName } from "@codegouvfr/react-dsfr";
import type { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import type { HeaderProps } from "@codegouvfr/react-dsfr/Header";
import type { Link } from "type-route";

import { routes } from "@/app/router";

export const CURRENT_HEADER_ITEM_CLASSES = "bg-blue-ultralight text-blue-ultradark";

export const ABOUT_IMPACTS_DIALOG_ID = "fr-dialog-about-impacts-header";

type HeaderItemIconId = FrIconClassName | RiIconClassName;

export type HeaderLinkItem = {
  kind: "link";
  iconId: HeaderItemIconId;
  text: string;
  linkProps: Link | { href: string };
  isCurrent?: boolean;
};

export type HeaderDialogItem = {
  kind: "dialog";
  iconId: HeaderItemIconId;
  text: string;
  nativeButtonProps: { "aria-controls": string; "data-fr-opened": false };
};

export type HeaderItem = HeaderLinkItem | HeaderDialogItem;

export const LOGIN_HEADER_ITEM = {
  kind: "link",
  iconId: "fr-icon-logout-box-r-line",
  text: "Accéder à Bénéfriches",
  linkProps: routes.accessBenefriches().link,
} as const satisfies HeaderLinkItem;

export const LOGOUT_HEADER_ITEM = {
  kind: "link",
  iconId: "fr-icon-logout-box-r-line",
  text: "Se déconnecter",
  linkProps: { href: "/api/auth/logout" },
} as const satisfies HeaderLinkItem;

export const FAQ_HEADER_ITEM = {
  kind: "dialog",
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

function buildNavigationHeaderItems({
  isAdmin,
  myEvaluationsLink,
  isMyEvaluationsCurrent,
}: BuildNavigationHeaderItemsInput): HeaderLinkItem[] {
  return [
    {
      kind: "link",
      iconId: "fr-icon-bar-chart-box-line",
      text: "Mes évaluations",
      linkProps: myEvaluationsLink,
      isCurrent: isMyEvaluationsCurrent,
    },
    ...(isAdmin
      ? [
          {
            kind: "link",
            iconId: "fr-icon-settings-5-line",
            text: "Administration",
            linkProps: routes.admin().link,
          } satisfies HeaderLinkItem,
        ]
      : []),
  ];
}

type LoggedInHeaderItems = {
  // Shown directly in the header bar
  inlineItems: HeaderItem[];
  // Shown in the header menu
  menuItems: HeaderItem[];
};

// Items shown to a logged-in user, in display order and per breakpoint, shared by every app header:
// on large screens navigation and FAQ sit in the header bar and logout in the menu,
// on small screens they are all listed in the menu.
export function buildLoggedInHeaderItems({
  isLargeScreen,
  ...navigationInput
}: BuildNavigationHeaderItemsInput & { isLargeScreen: boolean }): LoggedInHeaderItems {
  const items: HeaderItem[] = [...buildNavigationHeaderItems(navigationInput), FAQ_HEADER_ITEM];

  if (isLargeScreen) {
    return { inlineItems: items, menuItems: [LOGOUT_HEADER_ITEM] };
  }
  return { inlineItems: [], menuItems: [...items, LOGOUT_HEADER_ITEM] };
}

export function toHeaderButtonProps(item: HeaderItem): ButtonProps {
  switch (item.kind) {
    case "link":
      return {
        iconId: item.iconId,
        linkProps: item.linkProps,
        children: item.text,
        className: item.isCurrent ? CURRENT_HEADER_ITEM_CLASSES : undefined,
      };
    case "dialog":
      return {
        iconId: item.iconId,
        nativeButtonProps: item.nativeButtonProps,
        children: item.text,
      };
  }
}

// DSFR Header quick access items (rendered by DSFR in its own mobile menu)
export function toHeaderQuickAccessItem(item: HeaderItem): HeaderProps.QuickAccessItem {
  switch (item.kind) {
    case "link":
      return { iconId: item.iconId, text: item.text, linkProps: item.linkProps };
    case "dialog":
      return { iconId: item.iconId, text: item.text, buttonProps: item.nativeButtonProps };
  }
}
