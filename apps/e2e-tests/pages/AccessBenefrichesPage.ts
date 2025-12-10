import { expect, type Page } from "@playwright/test";

export class AccessBenefrichesPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectCurrentPage(): Promise<void> {
    await expect(this.page).toHaveURL((url) => url.pathname === "/acceder-a-benefriches");
  }

  async clickCreateAccount(): Promise<void> {
    await this.page.getByRole("link", { name: "Créer un compte" }).click();
  }

  async clickContinueWithEmail(): Promise<void> {
    await this.page.getByRole("button", { name: "Continuer avec mon adresse e-mail" }).click();
  }
}
