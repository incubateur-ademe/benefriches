import { expect, type Locator, type Page } from "@playwright/test";

export type OnboardingStepSlug = "bienvenue" | "methodologie" | "temoignages";

export class OnboardingStepPage {
  readonly page: Page;
  readonly progressIndicator: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.progressIndicator = this.page.getByRole("progressbar");
    this.backButton = this.page.getByRole("link", { name: "Retour" });
  }

  async goto(step: OnboardingStepSlug): Promise<void> {
    await this.page.goto(`/premiers-pas/${step}`);
  }

  async expectCurrentStep(step: OnboardingStepSlug): Promise<void> {
    await expect(this.page).toHaveURL((url) => url.pathname === `/premiers-pas/${step}`);
  }

  async expectShellVisible(): Promise<void> {
    await expect(this.progressIndicator).toBeVisible();
  }

  async expectNoBackButton(): Promise<void> {
    await expect(this.backButton).toHaveCount(0);
  }

  async expectBackButtonVisible(): Promise<void> {
    await expect(this.backButton).toBeVisible();
  }

  forwardButton(label: "Suivant" | "Commencer"): Locator {
    return this.page.getByRole("link", { name: label });
  }

  async clickBack(): Promise<void> {
    await this.backButton.click();
  }

  async clickForward(label: "Suivant" | "Commencer"): Promise<void> {
    await this.forwardButton(label).click();
  }
}
