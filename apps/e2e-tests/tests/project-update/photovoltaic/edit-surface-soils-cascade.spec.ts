import { expect, test } from "./fixtures";

// Still within the site's suitable area once the buildings are transformed (2760 + 1380 = 4140 m²),
// but above the untouched suitable area (2760 m²), so the panels still don't fit as-is and the
// non-suitable-soils steps stay in the sequence.
const UPDATED_SURFACE = 4000;

// Future operator is never answered by the API-seeded project, so the forward walk passes through it
// once on the way back to the summary (as in the other PV update specs).
const FUTURE_OPERATOR_LABEL = "Ma structure, ADEME";

test.describe("photovoltaic project editing with a soils-transformation cascade", () => {
  test("editing the panel surface resets the non-suitable and custom soils steps, which the user re-completes before saving", async ({
    myEvaluationsPage,
    pvProjectUpdatePage,
    nonSuitableSoilsPhotovoltaicProject,
    authenticatedPage,
  }) => {
    // --- Reach the update form; ticket 02's converter fix opens it valid on the summary ---
    await myEvaluationsPage.goto();
    await myEvaluationsPage.clickModifierForProject(nonSuitableSoilsPhotovoltaicProject.name);

    await expect(authenticatedPage).toHaveURL(
      new RegExp(`/mes-projets/${nonSuitableSoilsPhotovoltaicProject.id}/modifier`),
    );
    await pvProjectUpdatePage.expectFinalSummary();
    await pvProjectUpdatePage.expectNoCascadeDialog();

    // --- Reach the surface step ---
    // The parameters section's "Modifier" lands on the group's first step (key parameter), which
    // only offers "Valider" — re-submitting it would jump to the next empty step, not forward to
    // surface. So enter the following soils section (lands on the non-suitable-soils selection step)
    // and step back through the sequence to the surface: non-suitable selection → non-suitable
    // notice → soils intro → contract duration → production → surface.
    await pvProjectUpdatePage.clickEditSection(/Transformation des sols/);
    await pvProjectUpdatePage.expectStepTitle(/Quels espaces souhaitez-vous supprimer/i);
    await pvProjectUpdatePage.goBack(); // non-suitable soils notice
    await pvProjectUpdatePage.goBack(); // soils transformation intro
    await pvProjectUpdatePage.goBack(); // contract duration
    await pvProjectUpdatePage.goBack(); // expected annual production
    // Production is fetched on entry (loading spinner); expectStepTitle waits it out before we
    // step back once more.
    await pvProjectUpdatePage.expectStepTitle(/production annuelle attendue de l.installation/i);
    await pvProjectUpdatePage.goBack(); // surface
    await pvProjectUpdatePage.expectStepTitle(/superficie du site occuperont les panneaux/i);

    // --- Change the surface: still non-suitable, so the cascade dialog surfaces ---
    await pvProjectUpdatePage.fillSurface(UPDATED_SURFACE);

    await pvProjectUpdatePage.expectCascadeDialogListsSoilsSteps();
    await pvProjectUpdatePage.confirmCascadeAndComplete();

    // --- Re-complete the reset steps the update walk routes through ---
    // next_empty navigation lands on the first still-empty step of the walked sequence: the
    // non-suitable-soils selection, then its surface. The custom soils selection/allocation are
    // reset too, but the kept "custom" project-selection strategy retains its distribution and the
    // walk does not route back through those two steps, so the next empty step after the
    // non-suitable pair is the (never-answered) future operator.
    await pvProjectUpdatePage.expectStepTitle(/Quels espaces souhaitez-vous supprimer/i);
    await pvProjectUpdatePage.selectNonSuitableSoilsToTransform(["BUILDINGS"]);

    await pvProjectUpdatePage.expectStepTitle(/proportion de chaque espace/i);
    await pvProjectUpdatePage.fillNonSuitableSoilsSurfaceToTransform({ BUILDINGS: 1380 });

    await pvProjectUpdatePage.expectStepTitle(/exploitant de la centrale photovoltaïque/i);
    await pvProjectUpdatePage.selectStakeholder(FUTURE_OPERATOR_LABEL);

    // --- Back on the summary with the new surface; save in place, no error ---
    await pvProjectUpdatePage.expectFinalSummary();
    await pvProjectUpdatePage.expectNoCascadeDialog();
    await pvProjectUpdatePage.submitFinalSummary();
    await pvProjectUpdatePage.expectSaveSuccess();

    // --- Reopening confirms the edit persisted and the project is still valid ---
    await pvProjectUpdatePage.goto(nonSuitableSoilsPhotovoltaicProject.id);
    await pvProjectUpdatePage.expectFinalSummary();
    await pvProjectUpdatePage.expectUpdatePageTitle(nonSuitableSoilsPhotovoltaicProject.name);
  });
});
