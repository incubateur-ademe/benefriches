import { expect, type Page } from "@playwright/test";

export class UrbanProjectUpdatePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // --- Navigation ---

  async goto(projectId: string): Promise<void> {
    await this.page.goto(`/mes-projets/${projectId}/modifier`);
  }

  // --- Summary section navigation ---

  async clickEditSection(sectionTitle: string | RegExp): Promise<void> {
    const section = this.page.locator("section.mb-10").filter({
      has: this.page.getByRole("heading", { name: sectionTitle, level: 3 }),
    });
    await section.getByRole("button", { name: "Modifier" }).click();
  }

  // --- Sidebar navigation ---

  async selectSidebarGroup(groupLabel: string): Promise<void> {
    await this.page.getByRole("button", { name: groupLabel }).click();
  }

  async selectSidebarSubStep(subStepLabel: string): Promise<void> {
    await this.page.getByRole("button", { name: subStepLabel }).click();
  }

  // --- Buildings uses floor surface area ---

  async fillUsesFloorSurfaceArea(distribution: Record<string, number>): Promise<void> {
    for (const [label, value] of Object.entries(distribution)) {
      await this.page.getByRole("textbox", { name: label }).fill(String(value));
    }
    await this.submit();
  }

  // --- Buildings operating expenses ---

  async fillBuildingsOperatingExpenseAmount(
    field: "maintenance" | "taxes" | "other",
    amount: number,
  ): Promise<void> {
    const labels: Record<typeof field, string> = {
      maintenance: "Entretien et maintenance",
      taxes: "Taxes et impôts",
      other: "Autres charges d'exploitation",
    };
    await this.page.getByLabel(labels[field]).fill(String(amount));
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

  // --- Final summary ---

  async expectFinalSummary(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Récapitulatif du projet" })).toBeVisible();
  }

  // Summary rows render as `<dl><dd>{label}</dd><dt>{value}</dt></dl>` (FeaturesListDataLine).
  // Scoping to the row keeps the assertion tied to the label instead of any matching text
  // elsewhere on the page. Some labels (e.g. "Logements") appear in more than one summary
  // row (main distribution + "Nouveaux bâtiments" breakdown); `.first()` targets the primary
  // row, which always renders first in the DOM regardless of fixture data.
  async expectSummaryLineValue(label: string, value: string | RegExp): Promise<void> {
    const row = this.page
      .locator("dl")
      .filter({ has: this.page.locator("dd", { hasText: label }) });
    await expect(row.first().locator("dt")).toContainText(value);
  }

  async submitFinalSummary(): Promise<void> {
    await this.page.getByRole("button", { name: "Valider" }).click();
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

  private async submitOrSkipStep(): Promise<void> {
    await this.page.getByRole("button", { name: /Valider|Passer/ }).click();
  }
}
