import { asMegaWattHoursPerYear } from "../../../fixtures/helpers/format.helpers";
import { ORIGINAL_EXPECTED_ANNUAL_PRODUCTION, expect, test } from "./fixtures";

const UPDATED_EXPECTED_ANNUAL_PRODUCTION = 450;

test.describe("photovoltaic project editing on a site that already fits the panels", () => {
  test("editing the expected production requires no other change before saving", async ({
    myEvaluationsPage,
    pvProjectUpdatePage,
    photovoltaicProject,
    authenticatedPage,
  }) => {
    // --- Reach the update form from Mes évaluations ---
    await myEvaluationsPage.goto();
    await myEvaluationsPage.clickModifierForProject(photovoltaicProject.name);

    await expect(authenticatedPage).toHaveURL(
      new RegExp(`/mes-projets/${photovoltaicProject.id}/modifier`),
    );

    // The agricultural site's suitable soils cover the panel surface, so the project routes
    // through no non-suitable-soils steps: the update opens straight on a valid final summary,
    // with no cascade dialog.
    await pvProjectUpdatePage.expectFinalSummary();
    await pvProjectUpdatePage.expectNoCascadeDialog();
    await pvProjectUpdatePage.expectUpdatePageTitle(photovoltaicProject.name);
    await pvProjectUpdatePage.expectSummaryLineValue(
      "Production annuelle attendue",
      asMegaWattHoursPerYear(ORIGINAL_EXPECTED_ANNUAL_PRODUCTION),
    );

    // --- Edit the expected annual production, reached directly via its sidebar sub-step ---
    await pvProjectUpdatePage.selectSidebarStep("Paramètres du projet");
    await pvProjectUpdatePage.selectSidebarStep("Production annuelle attendue");
    // Production is fetched on entry (loading spinner); expectStepTitle waits it out.
    await pvProjectUpdatePage.expectStepTitle(
      "Quelle est la production annuelle attendue de l'installation",
    );

    await pvProjectUpdatePage.fillExpectedAnnualProduction(UPDATED_EXPECTED_ANNUAL_PRODUCTION);

    await pvProjectUpdatePage.expectFinalSummary();
    await pvProjectUpdatePage.expectNoCascadeDialog();
    await pvProjectUpdatePage.expectSummaryLineValue(
      "Production annuelle attendue",
      asMegaWattHoursPerYear(UPDATED_EXPECTED_ANNUAL_PRODUCTION),
    );
  });
});
