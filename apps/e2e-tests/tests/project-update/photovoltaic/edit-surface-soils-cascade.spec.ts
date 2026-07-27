import { expect, test } from "./fixtures";

// Still within the site's suitable area once the buildings are transformed (2760 + 1380 = 4140 m²),
// but above the untouched suitable area (2760 m²), so the panels still don't fit as-is and the
// non-suitable-soils steps stay in the sequence.
const UPDATED_SURFACE = 4000;

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
    await pvProjectUpdatePage.expectStepTitle("Quels espaces souhaitez-vous supprimer");
    await pvProjectUpdatePage.goBack();
    await pvProjectUpdatePage.expectStepTitle(
      "Le site n'est pas encore prêt à accueillir une centrale photovoltaïque",
    );
    await pvProjectUpdatePage.goBack();
    await pvProjectUpdatePage.expectStepTitle(
      "Nous allons maintenant parler de ce que seront les sols du site",
    );
    await pvProjectUpdatePage.goBack();
    await pvProjectUpdatePage.expectStepTitle(
      "Quelle sera la durée prévisionnelle du contrat de la revente d'énergie au distributeur",
    );
    await pvProjectUpdatePage.goBack();
    // Production is fetched on entry (loading spinner); expectStepTitle waits it out before we
    // step back once more.
    await pvProjectUpdatePage.expectStepTitle(
      "Quelle est la production annuelle attendue de l'installation",
    );
    await pvProjectUpdatePage.goBack();
    await pvProjectUpdatePage.expectStepTitle(
      "Quelle superficie du site occuperont les panneaux photovoltaïques",
    );

    // --- Change the surface: still non-suitable, so the cascade dialog surfaces ---
    await pvProjectUpdatePage.fillSurface(UPDATED_SURFACE);

    await pvProjectUpdatePage.expectCascadeDialogListsSoilsSteps();
    await pvProjectUpdatePage.confirmCascadeAndComplete();

    // --- Re-complete the reset steps the update walk routes through ---
    // next_empty navigation walks the sequence and stops on each step the cascade reset: the
    // non-suitable-soils pair, then — since the kept "custom" strategy routes through them — the
    // custom soils selection and its surface-area allocation, whose answers were reset too.
    await pvProjectUpdatePage.expectStepTitle("Quels espaces souhaitez-vous supprimer");
    await pvProjectUpdatePage.selectNonSuitableSoilsToTransform(["BUILDINGS"]);

    await pvProjectUpdatePage.expectStepTitle(
      "Quelle proportion de chaque espace souhaitez-vous supprimer",
    );
    await pvProjectUpdatePage.fillNonSuitableSoilsSurfaceToTransform({ BUILDINGS: 1380 });

    // The whole site (4600 m²) becomes mineral soil, which is suitable for panels and so covers
    // the new 4000 m² footprint.
    await pvProjectUpdatePage.expectStepTitle("Quels types de sols y aura-t-il sur ce site");
    await pvProjectUpdatePage.selectFutureSoils(["MINERAL_SOIL"]);

    await pvProjectUpdatePage.expectStepTitle("Quelles seront les superficies des sols");
    await pvProjectUpdatePage.fillFutureSoilsSurfaceAreas({ MINERAL_SOIL: 4600 });

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
