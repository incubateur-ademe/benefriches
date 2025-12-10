import { expect, type Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  async expectCurrentPage(): Promise<void> {
    await expect(this.page).toHaveURL((url) => url.pathname === "/");
  }

  async clickGetStarted(): Promise<void> {
    await this.page.getByRole("link", { name: "Commencer" }).click();
  }

  async clickAccessBenefriches(): Promise<void> {
    await this.page.getByRole("link", { name: "Accéder à Bénéfriches" }).click();
  }

  async clickAnalyzeCompatibility(): Promise<void> {
    await this.page.getByRole("link", { name: "Analyser la compatibilité de" }).click();
  }
}
