import { expect, type Locator, type Page } from "@playwright/test";

export type OnboardingStepSlug = "bienvenue" | "methodologie" | "temoignages";
export type OnboardingVariant = "evaluation-mutabilite" | "evaluation-impacts";

const METHODOLOGY_HEADING = "Avant de commencer, petit point méthodo.";
const TESTIMONIALS_HEADING = "Ils ont testé et approuvé Bénéfriches";

export class OnboardingStepPage {
  readonly page: Page;
  readonly progressIndicator: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.progressIndicator = this.page.getByRole("progressbar");
    this.backButton = this.page.getByRole("link", { name: "Retour" });
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  async expectCurrentStep(step: OnboardingStepSlug): Promise<void> {
    await expect(this.page).toHaveURL((url) => url.pathname === `/premiers-pas/${step}`);
  }

  async expectCurrentStepVariant(variant: OnboardingVariant): Promise<void> {
    await expect(this.page).toHaveURL((url) => url.searchParams.get("fonctionnalite") === variant);
  }

  async expectStepProgress(current: number, total: number): Promise<void> {
    await expect(this.progressIndicator).toHaveAttribute("aria-valuenow", String(current));
    await expect(this.progressIndicator).toHaveAttribute("aria-valuemax", String(total));
  }

  async expectNoBackButton(): Promise<void> {
    await expect(this.backButton).toHaveCount(0);
  }

  async expectBackButtonVisible(): Promise<void> {
    await expect(this.backButton).toBeVisible();
  }

  async expectHeadingVisible(name: string): Promise<void> {
    await expect(this.page.getByRole("heading", { name })).toBeVisible();
  }

  async expectTextVisible(text: string): Promise<void> {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  /** Asserts both the route and the heading for the "methodologie" step. */
  async expectMethodologyStep(): Promise<void> {
    await this.expectCurrentStep("methodologie");
    await this.expectHeadingVisible(METHODOLOGY_HEADING);
  }

  /** Asserts both the route and the heading for the "temoignages" step. */
  async expectTestimonialsStep(): Promise<void> {
    await this.expectCurrentStep("temoignages");
    await this.expectHeadingVisible(TESTIMONIALS_HEADING);
  }

  async expectForwardLabel(label: "Suivant" | "Commencer"): Promise<void> {
    await expect(this.forwardButton(label)).toBeVisible();
  }

  async expectExitedToImpactsForm(): Promise<void> {
    await expect(this.page).toHaveURL((url) => url.pathname === "/creer-site-foncier");
    await expect(this.page).toHaveURL(
      (url) => url.searchParams.get("evaluationMode") === "impacts",
    );
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

  /** Asserts the "bienvenue" step, then advances to "methodologie". */
  async completeWelcomeStep(welcomeHeading: string): Promise<void> {
    await this.expectCurrentStep("bienvenue");
    await this.expectHeadingVisible(welcomeHeading);
    await this.expectStepProgress(1, 3);
    await this.expectNoBackButton();
    await this.expectForwardLabel("Suivant");
    await this.clickForward("Suivant");
  }

  /** Asserts the "methodologie" step, then advances to "temoignages". */
  async completeMethodologyStep(): Promise<void> {
    await this.expectMethodologyStep();
    await this.expectStepProgress(2, 3);
    await this.expectBackButtonVisible();
    await this.expectForwardLabel("Suivant");
    await this.clickForward("Suivant");
  }

  /** Asserts the "temoignages" step, then clicks "Commencer" to exit the flow. */
  async completeTestimonialsStep(): Promise<void> {
    await this.expectTestimonialsStep();
    await this.expectStepProgress(3, 3);
    await this.expectBackButtonVisible();
    await this.expectForwardLabel("Commencer");
    await this.clickForward("Commencer");
  }
}
