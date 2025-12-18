import { expect, type Page } from "@playwright/test";
import { TestUser } from "../fixtures/auth.fixtures";

type SignupOptions = {
  withNewsletterSubscription?: boolean;
};

export class SignupPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectCurrentPage(): Promise<void> {
    await expect(this.page).toHaveURL((url) => url.pathname === "/premiers-pas/identite");
  }

  async fillForm(user: TestUser): Promise<void> {
    await this.page.getByLabel("Email").fill(user.email);
    await this.page.getByLabel("Prénom").fill(user.firstName);
    await this.page.getByLabel("Nom", { exact: true }).fill(user.lastName);
    await this.page.getByLabel("Type de structure").selectOption(user.structureType);
    await this.page.getByLabel("Nom de la structure").fill(user.structureName);
  }

  async acceptDataProtection(): Promise<void> {
    await this.page
      .getByRole("checkbox", { name: /J'ai lu et j'accepte que l'ADEME collecte mes données/ })
      .check({ force: true });
  }

  async acceptNewsletter(): Promise<void> {
    await this.page
      .getByRole("checkbox", { name: /Je souhaite recevoir la newsletter/ })
      .check({ force: true });
  }

  async submit(): Promise<void> {
    await this.page.getByRole("button", { name: "Commencer" }).click();
  }

  async completeSignup(user: TestUser, options: SignupOptions = {}): Promise<void> {
    await this.fillForm(user);
    await this.acceptDataProtection();
    if (options.withNewsletterSubscription) {
      await this.acceptNewsletter();
    }
    await this.submit();
  }
}
