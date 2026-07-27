import { asMegaWattHoursPerYear } from "../../../fixtures/helpers/format.helpers";
import {
  ORIGINAL_EXPECTED_ANNUAL_PRODUCTION,
  PHOTOVOLTAIC_PROJECT_NAME,
  expect,
  test,
} from "./fixtures";

const UPDATED_PROJECT_NAME = "Centrale photovoltaïque de Meylan (production révisée)";
const UPDATED_EXPECTED_ANNUAL_PRODUCTION = 450;

test.describe("photovoltaic project editing without a soils cascade", () => {
  test("opens a can-accommodate project valid on the summary, then edits production and name and saves with no cascade dialog", async ({
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

    // --- Edit the expected annual production ---
    // Production sits mid-way through the parameters group, so it is not a section's direct
    // navigation target. Enter the following soils section from the summary, then step back
    // three questions — soils-transformation intro, contract duration, production — to reach it.
    await pvProjectUpdatePage.clickEditSection(/Transformation des sols/);
    await pvProjectUpdatePage.goBack();
    await pvProjectUpdatePage.goBack();
    await pvProjectUpdatePage.goBack();
    // Production is fetched on entry (loading spinner); expectStepTitle waits it out.
    await pvProjectUpdatePage.expectStepTitle(/production annuelle attendue de l.installation/i);

    await pvProjectUpdatePage.fillExpectedAnnualProduction(UPDATED_EXPECTED_ANNUAL_PRODUCTION);

    await pvProjectUpdatePage.expectFinalSummary();
    await pvProjectUpdatePage.expectNoCascadeDialog();
    await pvProjectUpdatePage.expectSummaryLineValue(
      "Production annuelle attendue",
      asMegaWattHoursPerYear(UPDATED_EXPECTED_ANNUAL_PRODUCTION),
    );

    // --- Edit the project name via its summary section ---
    await pvProjectUpdatePage.clickEditSection(/Dénomination/);
    await expect(authenticatedPage.getByLabel(/Nom du projet/i)).toHaveValue(
      PHOTOVOLTAIC_PROJECT_NAME,
    );
    await pvProjectUpdatePage.fillNameAndDescription(UPDATED_PROJECT_NAME);

    await pvProjectUpdatePage.expectFinalSummary();
    await pvProjectUpdatePage.expectSummaryLineValue("Nom du projet", UPDATED_PROJECT_NAME);

    // --- Save in place, with no error ---
    await pvProjectUpdatePage.submitFinalSummary();
    await pvProjectUpdatePage.expectSaveSuccess();

    // --- Reopening confirms both edits persisted ---
    await pvProjectUpdatePage.goto(photovoltaicProject.id);
    await pvProjectUpdatePage.expectFinalSummary();
    await pvProjectUpdatePage.expectUpdatePageTitle(UPDATED_PROJECT_NAME);
    await pvProjectUpdatePage.expectSummaryLineValue(
      "Production annuelle attendue",
      asMegaWattHoursPerYear(UPDATED_EXPECTED_ANNUAL_PRODUCTION),
    );
  });
});
