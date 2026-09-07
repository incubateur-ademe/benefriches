import { expect, Locator, type Page } from "@playwright/test";

export class MyEvaluationsPage {
  readonly page: Page;
  readonly evaluateNewCustomSiteLink: Locator;
  readonly evaluateFirstCustomLink: Locator;
  readonly evaluateFirstDemoLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.evaluateNewCustomSiteLink = this.page.getByRole("link", {
      name: "Évaluer un nouveau site",
    });
    this.evaluateFirstCustomLink = this.page.getByRole("link", { name: "Évaluer mon site" });
    this.evaluateFirstDemoLink = this.page.getByRole("link", {
      name: "Évaluer un site et un projet démo",
    });
  }

  async goto(): Promise<void> {
    await this.page.goto("/mes-evaluations");
  }

  async expectCurrentPage(): Promise<void> {
    await expect(this.page).toHaveURL((url) => url.pathname === "/mes-evaluations");
  }

  async expectPageTitle(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Mes évaluations" })).toBeVisible();
  }

  async expectSiteVisible(siteName: string): Promise<void> {
    await expect(this.page.getByRole("heading", { name: siteName, level: 2 })).toBeVisible();
  }

  async expectEmptyList(): Promise<void> {
    await expect(this.page.getByText("Vous n'avez pas encore d'évaluation.")).toBeVisible();
  }

  async expectEvaluateFirstCustomSiteVisible(): Promise<void> {
    await expect(this.page.getByRole("link", { name: "Évaluer mon site" })).toBeVisible();
  }

  async expectEvaluateFirstExpressSiteVisible(): Promise<void> {
    await expect(this.evaluateFirstDemoLink).toBeVisible();
  }

  async clickEvaluateFirstCustomSiteLink(): Promise<void> {
    await this.evaluateFirstCustomLink.click();
  }

  async clickEvaluateFirstExpressSiteLink(): Promise<void> {
    await this.evaluateFirstDemoLink.click();
  }

  async expectEvaluateNewCustomSiteVisible(): Promise<void> {
    await expect(this.evaluateNewCustomSiteLink).toBeVisible();
  }

  async clickEvaluateNewCustomSiteLink(): Promise<void> {
    await this.evaluateNewCustomSiteLink.click();
  }

  async expectSitesListVisible(): Promise<void> {
    // Check that at least one site card is present (by looking for site links)
    await expect(
      this.page.getByRole("link", { name: "Voir toutes les données du site" }).first(),
    ).toBeVisible();
  }

  async openSiteFeatures(siteName: string): Promise<void> {
    const evaluationCard = this.page.locator("div.rounded-2xl").filter({
      has: this.page.getByRole("heading", { name: siteName, level: 2 }),
    });
    await evaluationCard.getByRole("link", { name: "Voir toutes les données du site" }).click();
  }

  async openFirstSiteFeatures(): Promise<void> {
    await this.page.getByRole("link", { name: "Voir toutes les données du site" }).first().click();
  }

  async clickModifierForProject(projectName: string): Promise<void> {
    const projectCard = this.page.locator("div.relative").filter({
      has: this.page.getByRole("heading", { name: projectName, level: 4 }),
    });
    await projectCard.getByRole("button", { name: "Ouvrir le menu d'actions" }).click();
    await projectCard.getByRole("menuitem", { name: "Modifier" }).click();
  }

  // --- Site card actions menu (MyEvaluationItem.tsx) ---

  // NOTE: distinct from the project card's menu above — the site card's toggle button is titled
  // "Voir plus de fonctionnalités" (not "Ouvrir le menu d'actions"), and its edit item reads
  // "Modifier le site" (not "Modifier").
  private siteEvaluationCard(siteName: string) {
    return this.page.locator("div.rounded-2xl").filter({
      has: this.page.getByRole("heading", { name: siteName, level: 2 }),
    });
  }

  async openSiteActionsMenu(siteName: string): Promise<void> {
    await this.siteEvaluationCard(siteName)
      .getByRole("button", { name: "Voir plus de fonctionnalités" })
      .click();
  }

  // NOTE: HeadlessUI v2's <MenuItems anchor="bottom end"> renders through a floating-ui portal,
  // so the open menu's items are no longer descendants of the site card. The menuitem locator
  // must not be scoped to the card container (see SiteFeaturesPage.ts's equivalent helper) —
  // only one menu can be open at a time, so an unscoped page-level locator is unambiguous.
  async clickModifierForSite(siteName: string): Promise<void> {
    await this.openSiteActionsMenu(siteName);
    await this.page.getByRole("menuitem", { name: "Modifier le site" }).click();
  }

  // The disabled action uses `aria-disabled` (not the native `disabled` attribute, which would
  // remove it from keyboard focus — see UpdateSiteMenuItem.tsx's doc comment) and renders its
  // reason as real, always-visible DOM text rather than a hover-only tooltip.
  async expectModifierDisabledForSite(
    siteName: string,
    reasonSubstring: string | RegExp,
  ): Promise<void> {
    await this.openSiteActionsMenu(siteName);
    const menuItem = this.page.getByRole("menuitem", { name: "Modifier le site" });
    await expect(menuItem).toHaveAttribute("aria-disabled", "true");
    await expect(menuItem).toContainText(reasonSubstring);
    // The disabled item's click handler only calls preventDefault() (see UpdateSiteMenuItem.tsx),
    // it never closes the menu, so it would otherwise stay open — covering/blocking whatever the
    // test interacts with next — until an explicit close.
    await this.page.keyboard.press("Escape");
  }
}
