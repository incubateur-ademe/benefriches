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

  private async submit(): Promise<void> {
    await this.page.getByRole("button", { name: /Valider|Suivant/ }).click();
  }
}
