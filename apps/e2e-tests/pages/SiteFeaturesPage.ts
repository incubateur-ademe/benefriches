import { expect, type Page } from "@playwright/test";

export class SiteFeaturesPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectCurrentPage(): Promise<void> {
    await expect(this.page).toHaveURL((url) =>
      /\/sites\/[^/]+\/caracteristiques$/.test(url.pathname),
    );
  }

  async expectSiteHeading(siteName: string): Promise<void> {
    await expect(this.page.getByRole("heading", { name: siteName })).toBeVisible();
  }

  async expectFeaturesDataLines(expectedDataList: [label: string, value: string][]): Promise<void> {
    for (const [label, value] of expectedDataList) {
      // Use case-sensitive regex to avoid matching tooltip text that may contain lowercase variants
      // e.g. "Bâtiments" label should not match tooltip text containing "bâtiments"
      const labelRegex = new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      await expect(
        this.page
          .locator("dl")
          .filter({ has: this.page.locator("dd", { hasText: labelRegex }) })
          .locator("dt"),
      ).toHaveText(value);
    }
  }

  // --- Site header actions menu (SitePageHeader.tsx) ---

  private async openSiteActionsMenu(): Promise<void> {
    await this.page.getByRole("button", { name: "Voir plus de fonctionnalités" }).click();
  }

  async clickModifierForSite(): Promise<void> {
    await this.openSiteActionsMenu();
    await this.page.getByRole("menuitem", { name: "Modifier le site" }).click();
  }

  // The disabled action uses `aria-disabled` (not the native `disabled` attribute, which would
  // remove it from keyboard focus — see UpdateSiteMenuItem.tsx's doc comment) and renders its
  // reason as real, always-visible DOM text rather than a hover-only tooltip.
  async expectModifierDisabledForSite(reasonSubstring: string | RegExp): Promise<void> {
    await this.openSiteActionsMenu();
    const menuItem = this.page.getByRole("menuitem", { name: "Modifier le site" });
    await expect(menuItem).toHaveAttribute("aria-disabled", "true");
    await expect(menuItem).toContainText(reasonSubstring);
    // The disabled item's click handler only calls preventDefault() (see UpdateSiteMenuItem.tsx),
    // it never closes the menu, so it would otherwise stay open — covering/blocking whatever the
    // test interacts with next — until an explicit close.
    await this.page.keyboard.press("Escape");
  }

  // --- Blocking screen shown on the update route for a non-editable site ---

  async expectNotEditableAlert(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: "Ce site ne peut pas être modifié" }),
    ).toBeVisible();
  }
}
