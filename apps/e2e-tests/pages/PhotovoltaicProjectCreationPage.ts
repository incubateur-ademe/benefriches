import { expect, type Page } from "@playwright/test";

export type CreateMode = "express" | "custom";

export class PhotovoltaicProjectCreationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // --- Navigation ---

  async goto(siteId: string): Promise<void> {
    await this.page.goto(`/creer-projet?siteId=${siteId}`);
  }

  async gotoWithProjectSuggestions(siteId: string): Promise<void> {
    await this.page.goto(
      `/creer-projet?siteId=${siteId}&projectSuggestions[]={"type"%3A"INDUSTRIAL_FACILITIES"%2C"compatibilityScore"%3A59.5},{"type"%3A"RENATURATION"%2C"compatibilityScore"%3A59.3},{"type"%3A"OFFICES"%2C"compatibilityScore"%3A52.7},{"type"%3A"RESIDENTIAL_NORMAL_AREA"%2C"compatibilityScore"%3A43.2},{"type"%3A"TOURISM_AND_CULTURAL_FACILITIES"%2C"compatibilityScore"%3A42},{"type"%3A"PUBLIC_FACILITIES"%2C"compatibilityScore"%3A40.5},{"type"%3A"PHOTOVOLTAIC_POWER_PLANT"%2C"compatibilityScore"%3A38.5}`,
    );
  }

  // --- Project type selection ---

  async selectProjectType(): Promise<void> {
    await this.page.getByText("Centrale d'énergie renouvelable").click();
    await this.submit();
  }

  // --- Renewable energy type selection ---

  async selectRenewableEnergyType(): Promise<void> {
    await this.page.getByText("Photovoltaïque", { exact: true }).click();
    await this.submit();
  }

  // --- Create mode selection ---

  async selectCreateMode(mode: CreateMode): Promise<void> {
    const labels: Record<CreateMode, RegExp> = {
      express: /J.ai pas ou peu de données/,
      custom: /J.ai des données précises/,
    };

    await this.page.locator('[role="radio"]').filter({ hasText: labels[mode] }).click();

    await this.submit();
  }

  async selectProjectTemplate(): Promise<void> {
    await this.page.getByText("Centrale photovoltaïque").click();
    await this.submit();
  }

  // --- Photovoltaic parameters ---

  async selectKeyParameter(parameter: "POWER" | "SURFACE"): Promise<void> {
    const labels = {
      POWER: "La puissance de l'installation",
      SURFACE: "La superficie de l'installation",
    };
    await this.page.getByText(labels[parameter]).click();
    await this.submit();
  }

  async fillPower(value: number): Promise<void> {
    await this.page.getByLabel(/Puissance de l'installation/i).fill(String(value));
    await this.submit();
  }

  async fillSurface(value: number): Promise<void> {
    await this.page.getByLabel(/Superficie de l'installation/i).fill(String(value));
    await this.submit();
  }

  async fillExpectedAnnualProduction(value: number): Promise<void> {
    await this.page.getByLabel(/Production attendue de l'installation/i).fill(String(value));
    await this.submit();
  }

  async fillContractDuration(value: number): Promise<void> {
    await this.page.getByLabel(/Durée du contrat de revente/i).fill(String(value));
    await this.submit();
  }

  // --- Soils transformation ---

  async goToNextStep(): Promise<void> {
    await this.page.getByRole("button", { name: "Suivant" }).click();
  }

  async selectSoilsTransformationProject(
    option: "renaturation" | "keepCurrentSoils" | "custom",
  ): Promise<void> {
    const labels = {
      renaturation: "Renaturer les sols au maximum",
      keepCurrentSoils: "Conserver les sols en l'état",
      custom: "Transformer les sols au cas par cas",
    };
    await this.page.getByText(labels[option]).click();
    await this.submit();
  }

  // --- Soils summary & carbon storage ---

  async expectSoilsSummaryStep(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: "Récapitulatif de l'occupation des sols" }),
    ).toBeVisible();
  }

  async expectSoilsCarbonStorageStep(): Promise<void> {
    await expect(this.page.getByText(/stockage de carbone/i)).toBeVisible();
  }

  // --- Stakeholders ---

  // oxlint-disable-next-line playwright/no-force-option -- DSFR labels overlay radio inputs
  async selectStakeholder(label: string | RegExp): Promise<void> {
    await this.page.getByRole("radio", { name: label }).check({ force: true });
    await this.submit();
  }

  // oxlint-disable-next-line playwright/no-force-option -- DSFR labels overlay radio inputs
  async selectSitePurchase(willBePurchased: boolean): Promise<void> {
    const label = willBePurchased ? "Oui" : "Non / Ne sait pas";
    await this.page.getByRole("radio", { name: label }).check({ force: true });
    await this.submit();
  }

  // --- Expenses & Revenue ---

  async skipStep(): Promise<void> {
    await this.page.getByRole("button", { name: "Passer" }).click();
  }

  async submitOrSkipStep(): Promise<void> {
    await this.page.getByRole("button", { name: /Valider|Passer/ }).click();
  }

  // --- Schedule ---

  async fillSchedule(
    startDate: string,
    endDate: string,
    firstYearOfOperation: number,
  ): Promise<void> {
    const startInput = this.page.getByLabel("Début des travaux");
    const endInput = this.page.getByLabel("Fin des travaux");
    const yearInput = this.page.getByLabel(/Année de mise en service/i);

    await startInput.pressSequentially(startDate.replace("/", ""), { delay: 50 });
    await endInput.pressSequentially(endDate.replace("/", ""), { delay: 50 });
    await yearInput.fill(String(firstYearOfOperation));

    await this.submit();
  }

  // --- Project phase ---

  async selectProjectPhase(label: string): Promise<void> {
    // Scope to label elements to avoid matching stepper nav items with the same text
    await this.page.locator("label").getByText(label, { exact: true }).click();
    await this.submit();
  }

  // --- Name and description ---

  async fillNameAndDescription(name: string, description?: string): Promise<void> {
    await this.page.getByLabel(/Nom du projet/i).fill(name);
    if (description) {
      await this.page.getByLabel(/Descriptif du projet/i).fill(description);
    }
    await this.submit();
  }

  // --- Final summary ---

  async expectFinalSummary(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Récapitulatif du projet" })).toBeVisible();
  }

  async submitFinalSummary(): Promise<void> {
    await this.page.getByRole("button", { name: "Valider" }).click();
  }

  // --- Creation result ---

  async expectCreationSuccess(projectName: string): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: `Le projet « ${projectName} » est créé !` }),
    ).toBeVisible();
  }

  // --- Private helpers ---

  private async submit(): Promise<void> {
    await this.page.getByRole("button", { name: /Valider|Suivant/ }).click();
  }

  async clickViewImportantInfo(): Promise<void> {
    await this.page.getByRole("link", { name: "Voir les infos importantes" }).click();
  }

  async expectOnboardingStep1(): Promise<void> {
    await expect(this.page.getByText("Bénéfriches calcule 6 types d'impacts.")).toBeVisible();
  }
}
