import { expect, type Page } from "@playwright/test";

export class LoginModal {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectVisible(): Promise<void> {
    await expect(
      this.page.getByRole("dialog", { name: "Demande de lien de connexion" }),
    ).toBeVisible();
  }

  async fillEmail(email: string): Promise<void> {
    await this.page.getByRole("textbox", { name: "Adresse e-mail" }).fill(email);
  }

  async clickReceiveLink(): Promise<void> {
    await this.page.getByRole("button", { name: "Recevoir un lien de connexion" }).click();
  }

  async expectSuccessMessage(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: "Un lien de connexion a été envoyé" }),
    ).toBeVisible();
  }

  async expectUnknownEmailError(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: "Aucun compte n'existe pour cette adresse e-mail" }),
    ).toBeVisible();
  }
}
