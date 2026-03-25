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
}
