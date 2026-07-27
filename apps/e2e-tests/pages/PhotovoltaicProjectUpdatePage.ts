import { expect, type Page } from "@playwright/test";

export type SoilTransformationSoilType =
  | "BUILDINGS"
  | "IMPERMEABLE_SOILS"
  | "MINERAL_SOIL"
  | "ARTIFICIAL_GRASS_OR_BUSHES_FILLED"
  | "ARTIFICIAL_TREE_FILLED";

const SOIL_TYPE_LABELS: Record<SoilTransformationSoilType, string> = {
  BUILDINGS: "Bâtiments",
  IMPERMEABLE_SOILS: "Sols imperméabilisés",
  MINERAL_SOIL: "Sols perméables minéraux",
  ARTIFICIAL_GRASS_OR_BUSHES_FILLED: "Sols enherbés et arbustifs",
  ARTIFICIAL_TREE_FILLED: "Sol arboré",
};

export class PhotovoltaicProjectUpdatePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // --- Navigation ---

  async goto(projectId: string): Promise<void> {
    await this.page.goto(`/mes-projets/${projectId}/modifier`);
  }

  async goBack(): Promise<void> {
    await this.page.getByRole("button", { name: "Précédent" }).click();
  }

  // --- Summary section navigation ---

  async clickEditSection(sectionTitle: string | RegExp): Promise<void> {
    const section = this.page.locator("section.mb-10").filter({
      has: this.page.getByRole("heading", { name: sectionTitle, level: 3 }),
    });
    await section.getByRole("button", { name: "Modifier" }).click();
  }

  // --- Sidebar navigation ---

  async selectSidebarStep(stepLabel: string): Promise<void> {
    await this.page.getByRole("button", { name: stepLabel, exact: true }).click();
  }

  // --- Yearly expenses ---

  async fillYearlyMaintenanceExpenseAmount(amount: number): Promise<void> {
    await this.page.getByLabel("Maintenance").fill(String(amount));
    await this.submitOrSkipStep();
  }

  // --- Page header ---

  async expectUpdatePageTitle(projectName: string): Promise<void> {
    await expect(this.page.getByText(`Modification du projet « ${projectName} »`)).toBeVisible();
  }

  // --- Step title ---

  async expectStepTitle(title: string | RegExp): Promise<void> {
    await expect(this.page.getByRole("heading", { name: title, level: 2 })).toBeVisible();
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

  // --- Non-suitable soils transformation (custom mode) ---

  async selectNonSuitableSoilsToTransform(soilTypes: SoilTransformationSoilType[]): Promise<void> {
    for (const soilType of soilTypes) {
      await this.page.getByText(SOIL_TYPE_LABELS[soilType], { exact: true }).click();
    }
    await this.submit();
  }

  async fillNonSuitableSoilsSurfaceToTransform(
    surfaceBySoilType: Partial<Record<SoilTransformationSoilType, number>>,
  ): Promise<void> {
    for (const [soilType, value] of Object.entries(surfaceBySoilType) as [
      SoilTransformationSoilType,
      number,
    ][]) {
      await this.page.getByLabel(SOIL_TYPE_LABELS[soilType]).fill(String(value));
    }
    await this.submit();
  }

  // --- Custom soils transformation (future soils) ---

  async selectFutureSoils(soilTypes: SoilTransformationSoilType[]): Promise<void> {
    for (const soilType of soilTypes) {
      await this.page.getByText(SOIL_TYPE_LABELS[soilType], { exact: true }).click();
    }
    await this.submit();
  }

  async fillFutureSoilsSurfaceAreas(
    surfaceBySoilType: Partial<Record<SoilTransformationSoilType, number>>,
  ): Promise<void> {
    for (const [soilType, value] of Object.entries(surfaceBySoilType) as [
      SoilTransformationSoilType,
      number,
    ][]) {
      await this.page.getByLabel(SOIL_TYPE_LABELS[soilType]).fill(String(value));
    }
    await this.submit();
  }

  async expectSoilsSummaryStep(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: "Récapitulatif de l'occupation des sols" }),
    ).toBeVisible();
  }

  async expectSoilsCarbonStorageStep(): Promise<void> {
    await expect(this.page.getByText(/stockage de carbone/i)).toBeVisible();
  }

  // --- Soils decontamination ---

  // oxlint-disable-next-line playwright/no-force-option -- DSFR labels overlay radio inputs
  async selectInvolvesReinstatement(involves: boolean): Promise<void> {
    const label = involves
      ? "Oui, le projet inclut des travaux de remise en état"
      : "Non, le projet ne prévoit pas de remise en état";
    await this.page.getByRole("radio", { name: label }).check({ force: true });
    await this.submit();
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

  async fillSitePurchaseSellingPrice(amount: number): Promise<void> {
    await this.page.getByLabel("Prix d'acquisition").fill(String(amount));
    await this.submitOrSkipStep();
  }

  async fillReinstatementExpenses(amount: number): Promise<void> {
    await this.page.getByLabel("Désamiantage").fill(String(amount));
    await this.submitOrSkipStep();
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

    await startInput.fill("");
    await startInput.pressSequentially(startDate.replace("/", ""), { delay: 50 });
    await endInput.fill("");
    await endInput.pressSequentially(endDate.replace("/", ""), { delay: 50 });
    await yearInput.fill(String(firstYearOfOperation));

    await this.submit();
  }

  // --- Name and description ---

  async fillNameAndDescription(name: string, description?: string): Promise<void> {
    await this.page.getByLabel(/Nom du projet/i).fill("");
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

  // Summary rows render as `<dl><dd>{label}</dd><dt>{value}</dt></dl>` (FeaturesListDataLine).
  // Scoping to the row keeps the assertion tied to the label instead of any matching text
  // elsewhere on the page.
  async expectSummaryLineValue(label: string, value: string | RegExp): Promise<void> {
    const row = this.page
      .locator("dl")
      .filter({ has: this.page.locator("dd", { hasText: label }) });
    await expect(row.first().locator("dt")).toContainText(value);
  }

  async submitFinalSummary(): Promise<void> {
    await this.page.getByRole("button", { name: "Valider" }).click();
  }

  // --- Cascading-change confirmation dialog ---

  // The dialog only appears when an edit invalidates downstream steps. On a site that can
  // accommodate the panels, no soils cascade is possible, so it must never surface.
  async expectNoCascadeDialog(): Promise<void> {
    await expect(
      this.page.getByRole("heading", {
        name: /La modification de cette étape entraîne d.autres modifications/,
      }),
    ).toHaveCount(0);
  }

  // When editing the panel surface on a non-suitable-soils project, the cascade dialog lists the
  // soils-transformation steps to reset. Every soils step belongs to the "Travaux" group, so the
  // reset list shows one or more "Travaux" entries.
  async expectCascadeDialogListsSoilsSteps(): Promise<void> {
    const dialog = this.page.locator(".fr-modal__body");
    await expect(
      dialog.getByRole("heading", {
        name: /La modification de cette étape entraîne d.autres modifications/,
      }),
    ).toBeVisible();
    await expect(
      dialog.getByText("Les étapes suivantes seront réinitialisées, vous devrez les compléter :"),
    ).toBeVisible();
    await expect(dialog.getByRole("listitem").filter({ hasText: "Travaux" }).first()).toBeVisible();
  }

  async confirmCascadeAndComplete(): Promise<void> {
    await this.page.getByRole("button", { name: "Valider et compléter les étapes" }).click();
  }

  // --- Save result ---

  async expectSaveSuccess(): Promise<void> {
    await expect(
      this.page.getByRole("button", { name: "Modifications sauvegardées" }),
    ).toBeVisible();
  }

  // --- Private helpers ---

  private async submit(): Promise<void> {
    await this.page.getByRole("button", { name: /Valider|Suivant/ }).click();
  }
}
