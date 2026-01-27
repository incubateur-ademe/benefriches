import { expect, type Page } from "@playwright/test";

export class MyEvaluationsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
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

  async expectSitesListVisible(): Promise<void> {
    // Check that at least one site card is present (by looking for site links)
    await expect(
      this.page.getByRole("link", { name: "Voir toutes les données du site" }).first(),
    ).toBeVisible();
  }
}
