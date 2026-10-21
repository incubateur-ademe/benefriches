import { routes } from "@/app/router";

import type { HeaderItem } from "./headerItems";
import { buildLoggedInHeaderItems, FAQ_HEADER_ITEM, LOGOUT_HEADER_ITEM } from "./headerItems";

// type-route links carry a fresh onClick on every build: compare them by href
function withLinkHrefs(items: HeaderItem[]) {
  return items.map((item) =>
    item.kind === "link" ? { ...item, linkProps: item.linkProps.href } : item,
  );
}

describe("buildLoggedInHeaderItems", () => {
  const myEvaluationsLink = routes.myEvaluations().link;

  const MY_EVALUATIONS_ITEM = {
    kind: "link",
    iconId: "fr-icon-bar-chart-box-line",
    text: "Mes évaluations",
    linkProps: "/mes-evaluations",
    isCurrent: true,
  } as const;

  const ADMINISTRATION_ITEM = {
    kind: "link",
    iconId: "fr-icon-settings-5-line",
    text: "Administration",
    linkProps: "/admin",
  } as const;

  const LOGOUT_ITEM = { ...LOGOUT_HEADER_ITEM, linkProps: LOGOUT_HEADER_ITEM.linkProps.href };

  it("shows navigation and FAQ in the header bar and logout in the menu on large screens", () => {
    const items = buildLoggedInHeaderItems({
      isAdmin: true,
      myEvaluationsLink,
      isMyEvaluationsCurrent: true,
      isLargeScreen: true,
    });

    expect({
      inlineItems: withLinkHrefs(items.inlineItems),
      menuItems: withLinkHrefs(items.menuItems),
    }).toEqual({
      inlineItems: [MY_EVALUATIONS_ITEM, ADMINISTRATION_ITEM, FAQ_HEADER_ITEM],
      menuItems: [LOGOUT_ITEM],
    });
  });

  it("lists navigation, FAQ and logout in the menu on small screens", () => {
    const items = buildLoggedInHeaderItems({
      isAdmin: true,
      myEvaluationsLink,
      isMyEvaluationsCurrent: true,
      isLargeScreen: false,
    });

    expect({
      inlineItems: withLinkHrefs(items.inlineItems),
      menuItems: withLinkHrefs(items.menuItems),
    }).toEqual({
      inlineItems: [],
      menuItems: [MY_EVALUATIONS_ITEM, ADMINISTRATION_ITEM, FAQ_HEADER_ITEM, LOGOUT_ITEM],
    });
  });

  it("leaves Administration out for a non-admin user", () => {
    const items = buildLoggedInHeaderItems({
      isAdmin: false,
      myEvaluationsLink,
      isMyEvaluationsCurrent: true,
      isLargeScreen: false,
    });

    expect({
      inlineItems: withLinkHrefs(items.inlineItems),
      menuItems: withLinkHrefs(items.menuItems),
    }).toEqual({
      inlineItems: [],
      menuItems: [MY_EVALUATIONS_ITEM, FAQ_HEADER_ITEM, LOGOUT_ITEM],
    });
  });
});
