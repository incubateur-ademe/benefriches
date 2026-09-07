import { expect, type Page } from "@playwright/test";

/**
 * Page object for the site-update wizard's *chrome* only — page title, summary navigation,
 * sidebar navigation, save-state button, cascading-changes dialog and unsaved-changes dialog.
 * Step interactions (filling a form, selecting an option) are reused from `SiteCreationPage`
 * and `UrbanZoneSiteCreationPage`: the update wizard renders the very same step components as
 * creation, through an injected lens (see SiteUpdateView.tsx), so there is nothing
 * update-specific to duplicate there.
 */
export class SiteUpdatePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(siteId: string): Promise<void> {
    await this.page.goto(`/sites/${siteId}/modifier`);
  }

  async expectUpdatePageTitle(siteName: string): Promise<void> {
    await expect(this.page.getByText(`Modification du site « ${siteName} »`)).toBeVisible();
  }

  async expectStepTitle(title: string | RegExp): Promise<void> {
    await expect(this.page.getByRole("heading", { name: title, level: 2 })).toBeVisible();
  }

  // --- Final summary ---

  async expectFinalSummary(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Récapitulatif du site" })).toBeVisible();
  }

  // Summary rows render as `<dl><dd>{label}</dd><dt>{value}</dt></dl>` (FeaturesListDataLine).
  // Scoping to the row keeps the assertion tied to the label instead of any matching text
  // elsewhere on the page.
  async expectSummaryLineValue(label: string | RegExp, value: string | RegExp): Promise<void> {
    const row = this.page
      .locator("dl")
      .filter({ has: this.page.locator("dd", { hasText: label }) });
    await expect(row.first().locator("dt")).toContainText(value);
  }

  // --- Summary section navigation ("Modifier" links, ticket 15) ---

  async clickEditSection(sectionTitle: string | RegExp): Promise<void> {
    const section = this.page.locator("section.mb-10").filter({
      has: this.page.getByRole("heading", { name: sectionTitle, level: 3 }),
    });
    await section.getByRole("button", { name: "Modifier" }).click();
  }

  // --- Sidebar navigation (clickable step groups) ---

  async selectSidebarStep(stepLabel: string): Promise<void> {
    await this.page.getByRole("button", { name: stepLabel, exact: true }).click();
  }

  // --- Save state (sidebar button, ticket 16) ---

  // Scoped to the page's <header> (SidebarLayout.tsx): the final-summary step's own content
  // (SiteDataSummary.tsx / UrbanZoneFinalSummary.tsx) renders its own next/save button that
  // shares the exact same label/success text (pre-existing, shared with creation's save-in-place
  // flow) — an unscoped role locator would resolve to two elements once both are on screen.
  private get headerSaveButton() {
    return this.page.locator("header").getByRole("button", {
      name: "Sauvegarder les modifications",
    });
  }

  async clickSave(): Promise<void> {
    await this.headerSaveButton.click();
  }

  async expectSaveButtonVisible(): Promise<void> {
    await expect(this.headerSaveButton).toBeVisible();
  }

  async expectSaveSuccess(): Promise<void> {
    await expect(
      this.page.locator("header").getByRole("button", { name: "Modifications sauvegardées" }),
    ).toBeVisible();
  }

  // --- Go back (sidebar secondary button) ---

  // Rendered via `linkProps` (useSiteUpdateSidebarActions.ts), so this is a real <a> (role
  // "link"), not a "button" — using the wrong role made the click hang until Playwright's
  // timeout instead of failing fast.
  async clickGoBack(): Promise<void> {
    await this.page
      .getByRole("link", {
        name: /Retour aux caractéristiques du site|Retour à mes évaluations/,
      })
      .click();
  }

  /**
   * Structural regression net: asserts the accessibility tree of the wizard's <main> region
   * against a committed YAML baseline. Scoped to <main> (not the whole page) so unrelated
   * sidebar/layout changes don't churn baselines. Aria snapshots carry no platform suffix, so
   * one baseline serves both local (macOS) and CI (Ubuntu) runs.
   */
  async expectWizardAriaSnapshot(name: string): Promise<void> {
    await expect(this.page.getByRole("main")).toMatchAriaSnapshot({ name });
  }

  // --- Cascading-changes confirmation dialog ---

  async expectNoCascadeDialog(): Promise<void> {
    await expect(
      this.page.getByRole("heading", {
        name: /La modification de cette étape entraîne d.autres modifications/,
      }),
    ).toHaveCount(0);
  }

  // Generic assertion: the cascade dialog is visible and lists `groupLabel` among the steps that
  // will be reset (e.g. "Gestion du site → Propriétaire").
  async expectCascadeDialogListsStep(groupLabel: string): Promise<void> {
    const dialog = this.page.locator(".fr-modal__body");
    await expect(
      dialog.getByRole("heading", {
        name: /La modification de cette étape entraîne d.autres modifications/,
      }),
    ).toBeVisible();
    await expect(
      dialog.getByText("Les étapes suivantes seront réinitialisées, vous devrez les compléter :"),
    ).toBeVisible();
    await expect(
      dialog.getByRole("listitem").filter({ hasText: groupLabel }).first(),
    ).toBeVisible();
  }

  async confirmCascadeAndComplete(): Promise<void> {
    await this.page.getByRole("button", { name: "Valider et compléter les étapes" }).click();
  }

  async cancelCascade(): Promise<void> {
    await this.page.getByRole("button", { name: "Annuler la modification" }).click();
  }

  // --- Unsaved-changes navigation blocker dialog (ticket 17) ---

  async expectUnsavedChangesDialog(): Promise<void> {
    await expect(
      this.page.getByRole("heading", {
        name: "Êtes-vous sûr·e de vouloir quitter sans sauvegarder ?",
      }),
    ).toBeVisible();
  }

  async expectNoUnsavedChangesDialog(): Promise<void> {
    await expect(
      this.page.getByRole("heading", {
        name: "Êtes-vous sûr·e de vouloir quitter sans sauvegarder ?",
      }),
    ).toHaveCount(0);
  }

  async cancelLeaving(): Promise<void> {
    await this.page.getByRole("button", { name: "Reprendre la modification" }).click();
  }

  async confirmLeaving(): Promise<void> {
    await this.page.getByRole("button", { name: "Quitter sans sauvegarder" }).click();
  }
}
