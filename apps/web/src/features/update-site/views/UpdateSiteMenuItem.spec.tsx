import { Menu, MenuItems } from "@headlessui/react";
import { render, screen } from "@testing-library/react";
import type { SiteNotEditableReason } from "shared";

import UpdateSiteMenuItem from "./UpdateSiteMenuItem";
import { SITE_NOT_EDITABLE_REASON_LABEL } from "./siteNotEditableReasonLabels";

function renderInMenu(ui: React.ReactElement) {
  return render(
    <Menu>
      <MenuItems static>{ui}</MenuItems>
    </Menu>,
  );
}

describe("UpdateSiteMenuItem", () => {
  it("links to the update wizard for that site when it is editable", () => {
    renderInMenu(
      <UpdateSiteMenuItem siteId="site-1" isEditable notEditableReason={null} from="site" />,
    );

    const menuItem = screen.getByRole("menuitem", { name: /Modifier le site/ });
    expect(menuItem).toHaveAttribute("href", "/sites/site-1/modifier?from=%22site%22");
  });

  it("remembers that the user came from Mes évaluations", () => {
    renderInMenu(
      <UpdateSiteMenuItem siteId="site-1" isEditable notEditableReason={null} from="evaluations" />,
    );

    const menuItem = screen.getByRole("menuitem", { name: /Modifier le site/ });
    expect(menuItem).toHaveAttribute("href", "/sites/site-1/modifier?from=%22evaluations%22");
  });

  it("renders the action disabled instead of hiding it when the site is not editable", () => {
    renderInMenu(
      <UpdateSiteMenuItem
        siteId="site-1"
        isEditable={false}
        notEditableReason="NOT_CUSTOM"
        from="site"
      />,
    );

    const menuItem = screen.getByRole("menuitem", { name: /Modifier le site/ });
    expect(menuItem).toBeInTheDocument();
    expect(menuItem).toHaveAttribute("aria-disabled", "true");
    expect(menuItem).not.toHaveAttribute("href");
  });

  it("keeps the disabled action reachable with the keyboard", () => {
    renderInMenu(
      <UpdateSiteMenuItem
        siteId="site-1"
        isEditable={false}
        notEditableReason="NOT_CUSTOM"
        from="site"
      />,
    );

    const menuItem = screen.getByRole("menuitem", { name: /Modifier le site/ });
    menuItem.focus();

    expect(menuItem).toHaveFocus();
    expect(menuItem).not.toBeDisabled();
  });

  it("tells the user to remove the projects first", () => {
    renderInMenu(
      <UpdateSiteMenuItem
        siteId="site-1"
        isEditable={false}
        notEditableReason="ACTIVE_RECONVERSION_PROJECT"
        from="site"
      />,
    );

    expect(screen.getByText(/Supprimez .*projets/i)).toBeInTheDocument();
  });

  const reasons: SiteNotEditableReason[] = [
    "NOT_CREATOR",
    "NOT_CUSTOM",
    "ACTIVE_RECONVERSION_PROJECT",
  ];

  for (const reason of reasons) {
    it(`surfaces the server-provided reason to assistive technology for ${reason}`, () => {
      renderInMenu(
        <UpdateSiteMenuItem
          siteId="site-1"
          isEditable={false}
          notEditableReason={reason}
          from="site"
        />,
      );

      const menuItem = screen.getByRole("menuitem", { name: /Modifier le site/ });
      const describedById = menuItem.getAttribute("aria-describedby");

      expect(describedById).toBeTruthy();
      // eslint-disable-next-line testing-library/no-node-access
      const reasonElement = document.getElementById(describedById ?? "");

      expect(reasonElement).not.toBeNull();
      expect(reasonElement).toHaveTextContent(SITE_NOT_EDITABLE_REASON_LABEL[reason]);
      expect(menuItem).not.toHaveAttribute("title", SITE_NOT_EDITABLE_REASON_LABEL[reason]);
    });
  }
});
