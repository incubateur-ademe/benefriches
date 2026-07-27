import { expect, test } from "./fixtures";

test.describe("photovoltaic project editing when site reinstatement is enabled", () => {
  test("enabling site reinstatement requires specifying who owns the works and their cost before saving", async ({
    myEvaluationsPage,
    pvProjectUpdatePage,
    fricheReinstatementProject,
    authenticatedPage,
  }) => {
    // --- Reach the update form; the friche project opens fully answered ---
    await myEvaluationsPage.goto();
    await myEvaluationsPage.clickModifierForProject(fricheReinstatementProject.name);

    await expect(authenticatedPage).toHaveURL(
      new RegExp(`/mes-projets/${fricheReinstatementProject.id}/modifier`),
    );
    await pvProjectUpdatePage.expectFinalSummary();
    await pvProjectUpdatePage.expectNoCascadeDialog();

    // --- Reach the reinstatement question directly via its sidebar sub-step ---
    await pvProjectUpdatePage.selectSidebarStep("Travaux");
    await pvProjectUpdatePage.selectSidebarStep("Remise en état");
    await pvProjectUpdatePage.expectStepTitle(/Le projet prévoit-il une remise en état du site/);

    // --- Switching to "yes" adds two new required steps to the sequence: no cascade dialog,
    // since nothing already-answered gets invalidated by this transition, only new steps appear ---
    await pvProjectUpdatePage.selectInvolvesReinstatement(true);

    await pvProjectUpdatePage.expectStepTitle(
      "Qui sera le maître d'ouvrage des travaux de remise en état de la friche ?",
    );
    await pvProjectUpdatePage.selectStakeholder(/Ma structure/);

    await pvProjectUpdatePage.expectStepTitle("Dépenses de travaux de remise en état de la friche");
    await pvProjectUpdatePage.fillReinstatementExpenses(15000);

    // --- Both new steps answered: back on a valid summary, no cascade dialog ---
    await pvProjectUpdatePage.expectFinalSummary();
    await pvProjectUpdatePage.expectNoCascadeDialog();

    // --- Save in place, with no error ---
    await pvProjectUpdatePage.submitFinalSummary();
    await pvProjectUpdatePage.expectSaveSuccess();

    // --- Reopening confirms the project is still valid, with reinstatement now involved ---
    await pvProjectUpdatePage.goto(fricheReinstatementProject.id);
    await pvProjectUpdatePage.expectFinalSummary();
    await pvProjectUpdatePage.expectUpdatePageTitle(fricheReinstatementProject.name);
  });
});
