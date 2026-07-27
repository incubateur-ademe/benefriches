import { expect, test } from "./fixtures";

// Still within the site's suitable area once the buildings are transformed (2760 + 1380 = 4140 m²),
// but above the untouched suitable area (2760 m²), so the panels still don't fit as-is and the
// non-suitable-soils steps stay in the sequence.
const UPDATED_SURFACE = 4000;

test.describe("photovoltaic project editing when the panel surface exceeds the site's suitable soils", () => {
  test("increasing the panel surface requires redefining which soils to transform before saving", async ({
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

    // --- Reach the surface step directly via the sidebar sub-step ---
    // The parameters group's row lands on the group's first step (key parameter); clicking it
    // first makes the group "active" so its sub-steps render, then the "Surface des panneaux"
    // sub-step navigates straight to the surface step — no backwards walking required.
    await pvProjectUpdatePage.selectSidebarStep("Paramètres du projet");
    await pvProjectUpdatePage.selectSidebarStep("Surface des panneaux");
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

    // --- Another mid-group step (Puissance, the other field the original bug report couldn't
    // reach) stays directly reachable via its own sidebar sub-step, alongside surface above ---
    await pvProjectUpdatePage.selectSidebarStep("Paramètres du projet");
    await pvProjectUpdatePage.selectSidebarStep("Puissance");
    await pvProjectUpdatePage.expectStepTitle("Quelle sera la puissance de l'installation ?");
  });
});
