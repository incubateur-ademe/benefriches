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

  async expectIntroductionStep(siteName: string): Promise<void> {
    await expect(
      this.page.getByRole("heading", {
        name: `Vous souhaitez évaluer un projet d'aménagement sur le site "${siteName}".`,
      }),
    ).toBeVisible();
  }

  async clickStart(): Promise<void> {
    await this.page.getByRole("button", { name: "Commencer" }).click();
  }

  async selectProjectType(type: "URBAN_PROJECT"): Promise<void> {
    const labels: Record<typeof type, string> = {
      URBAN_PROJECT: "Autre projet d'aménagement",
    };
    await this.page.getByText(labels[type]).click();
    await this.submit();
  }

  async selectCreateMode(mode: CreateMode): Promise<void> {
    const labels: Record<CreateMode, string> = {
      express: "Mode express",
      custom: "Mode personnalisé",
    };
    await this.page.getByText(labels[mode]).click();
    await this.submit();
  }

  async selectUrbanProjectTemplate(template: ExpressUrbanProjectTemplate): Promise<void> {
    const label = getLabelForUrbanProjectCategory(template);
    await this.page.getByText(label).click();
    await this.submit();
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
