import { expect, type Page } from "@playwright/test";

import {
  getLabelForUrbanProjectCategory,
  type ExpressUrbanProjectTemplate,
} from "./urbanProjectCategoryLabels";

export type CreateMode = "express" | "custom";

export class UrbanProjectCreationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(siteId: string): Promise<void> {
    await this.page.goto(`/creer-projet?siteId=${siteId}`);
  }

  async gotoWithProjectSuggestions(siteId: string): Promise<void> {
    await this.page.goto(
      `/creer-projet?siteId=${siteId}&projectSuggestions[]={"type"%3A"INDUSTRIAL_FACILITIES"%2C"compatibilityScore"%3A59.5},{"type"%3A"RENATURATION"%2C"compatibilityScore"%3A59.3},{"type"%3A"OFFICES"%2C"compatibilityScore"%3A52.7},{"type"%3A"RESIDENTIAL_NORMAL_AREA"%2C"compatibilityScore"%3A43.2},{"type"%3A"TOURISM_AND_CULTURAL_FACILITIES"%2C"compatibilityScore"%3A42},{"type"%3A"PUBLIC_FACILITIES"%2C"compatibilityScore"%3A40.5},{"type"%3A"PHOTOVOLTAIC_POWER_PLANT"%2C"compatibilityScore"%3A38.5}`,
    );
  }

  async selectProjectType(type: "URBAN_PROJECT"): Promise<void> {
    const labels: Record<typeof type, string> = {
      URBAN_PROJECT: "Autre projet d'aménagement",
    };
    await this.page.getByText(labels[type]).click();
    await this.submit();
  }

  async selectCreateMode(mode: CreateMode): Promise<void> {
    const labels: Record<CreateMode, RegExp> = {
      express: /J.ai pas ou peu de données/,
      custom: /J.ai des données précises/,
    };

    await this.page.locator('[role="radio"]').filter({ hasText: labels[mode] }).click();

    await this.submit();
  }

  async selectProjectPhase(label: string): Promise<void> {
    await this.page.getByText(label).click();
    await this.submit();
  }

  async goToNextStep(): Promise<void> {
    await this.page.getByRole("button", { name: "Suivant" }).click();
  }

  async selectUrbanProjectUse(label: string): Promise<void> {
    // Scope to label elements to avoid matching <h4> category headings with the same text
    await this.page.locator("label").getByText(label, { exact: true }).click();
    await this.submit();
  }

  async selectUrbanProjectUses(labels: string[]): Promise<void> {
    for (const label of labels) {
      await this.page.locator("label").getByText(label, { exact: true }).click();
    }
    await this.submit();
  }

  async fillUsesFloorSurfaceArea(distribution: Record<string, number>): Promise<void> {
    for (const [label, value] of Object.entries(distribution)) {
      await this.page.getByRole("textbox", { name: label }).fill(String(value));
    }
    await this.submit();
  }

  async selectProjectSpaces(labels: string[]): Promise<void> {
    for (const label of labels) {
      // Some spaces may be pre-selected by default (e.g., BUILDINGS when uses include buildings).
      // Only click if not already selected to avoid deselecting pre-selected items.
      const tile = this.page.locator('div[role="checkbox"]').filter({
        has: this.page.locator("label").getByText(label, { exact: true }),
      });
      const isChecked = await tile.locator("input").isChecked();
      if (!isChecked) {
        await tile.locator("label").getByText(label, { exact: true }).click();
      }
    }
    await this.submit();
  }

  async fillProjectSpacesSurfaceArea(distribution: Record<string, number>): Promise<void> {
    // Switch to square meters input mode (default is percentage)
    // oxlint-disable-next-line playwright/no-force-option -- DSFR labels overlay radio inputs
    await this.page.getByRole("radio", { name: "㎡" }).check({ force: true });
    for (const [label, value] of Object.entries(distribution)) {
      await this.page.getByRole("textbox", { name: label }).fill(String(value));
    }
    await this.submit();
  }

  async expectBuildingsReuseIntroduction(): Promise<void> {
    await expect(
      this.page.getByRole("heading", {
        name: "Bonne nouvelle ! Le site comporte déjà des bâtiments.",
      }),
    ).toBeVisible();
  }

  async expectBuildingsNewConstructionIntroduction(surfaceArea: string): Promise<void> {
    await expect(
      this.page.getByRole("heading", {
        name: new RegExp(
          `${escapeRegExp(surfaceArea)} de surface au sol de nouveaux bâtiments seront à construire pour le projet urbain\\.`,
        ),
      }),
    ).toBeVisible();
  }

  async fillBuildingsFootprintToReuse(value: number): Promise<void> {
    // Switch to square meters input mode (default is percentage)
    // oxlint-disable-next-line playwright/no-force-option -- DSFR labels overlay radio inputs
    await this.page.getByRole("radio", { name: "㎡" }).check({ force: true });
    await this.page.getByRole("textbox", { name: "Surface à réutiliser" }).fill(String(value));
    await this.page.getByRole("button", { name: "Valider" }).click();
  }

  async expectBuildingsDemolitionInfo(surfaceArea: string): Promise<void> {
    await expect(
      this.page.getByRole("heading", {
        name: new RegExp(`${escapeRegExp(surfaceArea)} de bâtiments seront démolis\\.`),
      }),
    ).toBeVisible();
  }

  async fillExistingBuildingsUsesFloorSurfaceArea(
    distribution: Record<string, number>,
  ): Promise<void> {
    for (const [label, value] of Object.entries(distribution)) {
      await this.page.getByRole("textbox", { name: label }).fill(String(value));
    }
    await this.page.getByRole("button", { name: "Valider" }).click();
  }

  async expectBuildingsNewConstructionInfo(surfaceArea: string): Promise<void> {
    await expect(
      this.page.getByRole("heading", {
        name: new RegExp(
          `${escapeRegExp(surfaceArea)} de surface au sol de nouveaux bâtiments seront à construire pour le projet urbain\\.`,
        ),
      }),
    ).toBeVisible();
  }

  async fillNewBuildingsUsesFloorSurfaceArea(distribution: Record<string, number>): Promise<void> {
    for (const [label, value] of Object.entries(distribution)) {
      await this.page.getByRole("textbox", { name: label }).fill(String(value));
    }
    await this.page.getByRole("button", { name: "Valider" }).click();
  }

  // oxlint-disable-next-line playwright/no-force-option -- DSFR labels overlay radio inputs
  async selectSiteResale(willBeResold: boolean): Promise<void> {
    const label = willBeResold
      ? "Oui, un ou plusieurs acteurs ou opérateurs acquerront entièrement le site"
      : "Non, l'aménageur restera entièrement propriétaire du site";
    await this.page.getByRole("radio", { name: label }).check({ force: true });
    await this.submit();
  }

  // oxlint-disable-next-line playwright/no-force-option -- DSFR labels overlay radio inputs
  async selectBuildingsResale(willBeResold: boolean): Promise<void> {
    const label = willBeResold
      ? "Oui, les bâtiments seront revendus"
      : "Non, les bâtiments resteront exclusivement la propriété de l'aménageur";
    await this.page.getByRole("radio", { name: label }).check({ force: true });
    await this.submit();
  }

  // oxlint-disable-next-line playwright/no-force-option -- DSFR labels overlay radio inputs
  async selectStakeholder(label: string | RegExp): Promise<void> {
    await this.page.getByRole("radio", { name: label }).check({ force: true });
    await this.submit();
  }

  // oxlint-disable-next-line playwright/no-force-option -- DSFR labels overlay radio inputs
  async selectBuildingsDeveloper(developerBuilds: boolean): Promise<void> {
    await this.page
      .getByRole("radio", { name: developerBuilds ? "Oui" : "Non" })
      .check({ force: true });
    await this.submit();
  }

  async selectUrbanProjectTemplate(template: ExpressUrbanProjectTemplate): Promise<void> {
    const label = getLabelForUrbanProjectCategory(template);
    await this.page.getByText(label).click();
    await this.submit();
  }

  async expectDemoProjectOptionWithCompatibilityBadge(
    template: ExpressUrbanProjectTemplate,
    badgeText: string,
  ): Promise<void> {
    const tile = this.page.getByRole("radio").filter({
      hasText: getLabelForUrbanProjectCategory(template),
    });
    for (const text of badgeText.split(" ")) {
      await expect(tile).toContainText(text);
    }
  }

  async expectSummaryStepWithDataInList(
    expectedDataList: [label: string, value: string][],
  ): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Récapitulatif du projet" })).toBeVisible();

    for (const [label, value] of expectedDataList) {
      await expect(this.page.locator("dl").filter({ hasText: label }).locator("dt")).toHaveText(
        value,
      );
    }
  }

  async submitSummary(): Promise<void> {
    await this.page.getByRole("button", { name: "Valider" }).click();
  }

  async expectCreationSuccess(
    projectName: ReturnType<typeof getLabelForUrbanProjectCategory>,
  ): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: `Le projet « ${projectName} » est créé !` }),
    ).toBeVisible({ timeout: 10000 });
  }

  async clickViewImportantInfo(): Promise<void> {
    await this.page.getByRole("link", { name: "Voir les infos importantes" }).click();
  }

  async expectOnboardingStep1(): Promise<void> {
    await expect(this.page.getByText("Bénéfriches calcule 6 types d'impacts.")).toBeVisible();
  }

  async submitOrSkipStep(): Promise<void> {
    await this.page.getByRole("button", { name: /Valider|Passer/ }).click();
  }

  async fillSchedule(
    startDate: string,
    endDate: string,
    firstYearOfOperation: number,
  ): Promise<void> {
    // The schedule form may have two sections (reinstatement + installation) for friche sites,
    // or just one (installation) for non-friche sites.
    // Using .first() and .last() handles both cases: when there is only one element they both
    // resolve to the same element, when there are two, .last() targets the installation schedule.
    const startInputs = this.page.getByLabel("Début des travaux");
    const endInputs = this.page.getByLabel("Fin des travaux");

    // Blur through the first schedule section (reinstatement if present, otherwise installation)
    // so React Hook Form considers those fields validated and enables the submit button.
    await startInputs.first().click();
    await startInputs.first().press("Tab");
    await endInputs.first().press("Tab");

    // Fill the last schedule section (always the installation schedule).
    // Triple-click selects all existing text (clears pre-filled defaults) before typing.
    await startInputs.last().click({ clickCount: 3 });
    await startInputs.last().pressSequentially(startDate.replace("/", ""), { delay: 50 });
    await endInputs.last().click({ clickCount: 3 });
    await endInputs.last().pressSequentially(endDate.replace("/", ""), { delay: 50 });

    const yearInput = this.page.getByLabel(/Année de mise en service/i);
    await yearInput.fill(String(firstYearOfOperation));
    await yearInput.press("Tab"); // blur → triggers validation, enabling the submit button
    await this.submit();
  }

  async selectProjectPhase(label: string): Promise<void> {
    // Scope to label elements to avoid matching stepper nav items with the same text
    await this.page.locator("label").getByText(label, { exact: true }).click();
    await this.submit();
  }

  async fillNameAndDescription(name: string, description?: string): Promise<void> {
    await this.page.getByLabel(/Nom du projet/i).fill(name);
    if (description) {
      await this.page.getByLabel(/Descriptif du projet/i).fill(description);
    }
    await this.submit();
  }

  async expectFinalSummary(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Récapitulatif du projet" })).toBeVisible();
  }

  async submitFinalSummary(): Promise<void> {
    await this.page.getByRole("button", { name: "Valider" }).click();
  }

  private async submit(): Promise<void> {
    await this.page.getByRole("button", { name: /Valider|Suivant/ }).click();
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
