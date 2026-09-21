import { expect, type Page } from "@playwright/test";

/**
 * Page object for the OLD 3-page onboarding flow (when-to-use / when-not-to-use /
 * how-it-works), restored for the "evaluation-mutabilite" entry point
 * ("Analyser la compatibilité de ma friche" CTA) only.
 *
 * Not to be confused with `OnboardingStepPage`, which covers the NEW step-shell
 * flow (bienvenue / methodologie / temoignages) used by every other entry point.
 */
export class OnboardingLegacyFlowPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectWhenToUseStep(): Promise<void> {
    await expect(this.page).toHaveURL(
      (url) => url.pathname === "/premiers-pas/quand-utiliser-benefriches",
    );
    await expect(
      this.page.getByRole("heading", {
        name: "Bienvenue sur Bénéfriches ! Vous êtes au bon endroit si :",
      }),
    ).toBeVisible();
  }

  async expectWhenNotToUseStep(): Promise<void> {
    await expect(this.page).toHaveURL(
      (url) => url.pathname === "/premiers-pas/quand-ne-pas-utiliser-benefriches",
    );
    await expect(
      this.page.getByRole("heading", { name: "En revanche, Bénéfriches n'est pas adapté si :" }),
    ).toBeVisible();
  }

  async expectHowItWorksStep(): Promise<void> {
    await expect(this.page).toHaveURL((url) => url.pathname === "/premiers-pas/comment-ca-marche");
    await expect(
      this.page.getByRole("heading", { name: "Bénéfriches, comment ça marche ?" }),
    ).toBeVisible();
  }

  async expectVariant(variant: "evaluation-mutabilite" | "evaluation-impacts"): Promise<void> {
    await expect(this.page).toHaveURL((url) => url.searchParams.get("fonctionnalite") === variant);
  }

  async clickNext(): Promise<void> {
    await this.page.getByRole("link", { name: "Suivant" }).click();
  }

  async clickGetStarted(): Promise<void> {
    await this.page.getByRole("link", { name: "C'est parti" }).click();
  }

  /**
   * Walks forward through all three legacy onboarding steps (when-to-use ->
   * when-not-to-use -> how-it-works), asserting the route, heading and variant of
   * each step along the way, then clicks "C'est parti" to exit the flow.
   */
  async completeAllSteps(variant: "evaluation-mutabilite" | "evaluation-impacts"): Promise<void> {
    await this.expectWhenToUseStep();
    await this.expectVariant(variant);
    await this.clickNext();

    await this.expectWhenNotToUseStep();
    await this.expectVariant(variant);
    await this.clickNext();

    await this.expectHowItWorksStep();
    await this.expectVariant(variant);
    await this.clickGetStarted();
  }
}
