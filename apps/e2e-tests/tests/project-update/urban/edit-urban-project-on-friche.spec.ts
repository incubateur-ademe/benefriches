import { asEuroAmount, asSquareMeters } from "../../../fixtures/helpers/format.helpers";
import { expect, test } from "./fixtures";

const ORIGINAL_RESIDENTIAL_FLOOR_AREA = 250;
const UPDATED_RESIDENTIAL_FLOOR_AREA = 800;
const UPDATED_DEIMPERMEABILIZATION_AMOUNT = 40000;

test.describe("urban project editing on a friche", () => {
  test("allows a user to reach urban-project update from Mes évaluations, edit a parameter via a summary section link, then edit a reinstatement expense via the sidebar, and save in place", async ({
    myEvaluationsPage,
    urbanProjectUpdatePage,
    fricheUrbanProject,
    authenticatedPage,
  }) => {
    // --- Reach the update form from the project card's menu ---
    await myEvaluationsPage.goto();
    await myEvaluationsPage.clickModifierForProject(fricheUrbanProject.name);

    await expect(authenticatedPage).toHaveURL(
      new RegExp(`/mes-projets/${fricheUrbanProject.id}/modifier`),
    );
    await urbanProjectUpdatePage.expectFinalSummary();
    await urbanProjectUpdatePage.expectUpdatePageTitle(fricheUrbanProject.name);

    await urbanProjectUpdatePage.expectSummaryLineValue(
      "Logements",
      asSquareMeters(ORIGINAL_RESIDENTIAL_FLOOR_AREA),
    );

    // --- Edit floor surface area via the summary section's "Modifier" link ---
    await urbanProjectUpdatePage.clickEditSection(/Bâtiments/);
    await urbanProjectUpdatePage.expectStepTitle(
      /Quelle surface de plancher feront les différents usages/,
    );

    await urbanProjectUpdatePage.fillUsesFloorSurfaceArea({
      Logements: UPDATED_RESIDENTIAL_FLOOR_AREA,
    });

    await urbanProjectUpdatePage.expectFinalSummary();
    await urbanProjectUpdatePage.expectSummaryLineValue(
      "Logements",
      asSquareMeters(UPDATED_RESIDENTIAL_FLOOR_AREA),
    );

    // --- Edit a reinstatement expense via the sidebar navigation ---
    await urbanProjectUpdatePage.selectSidebarGroup("Dépenses");
    await urbanProjectUpdatePage.selectSidebarSubStep("Remise en état du site");

    await urbanProjectUpdatePage.fillReinstatementExpenseAmount(
      "Désimperméabilisation",
      UPDATED_DEIMPERMEABILIZATION_AMOUNT,
    );

    // --- Both edits (different navigation paths) survived ---
    await urbanProjectUpdatePage.expectFinalSummary();
    await urbanProjectUpdatePage.expectSummaryLineValue(
      "Logements",
      asSquareMeters(UPDATED_RESIDENTIAL_FLOOR_AREA),
    );
    await urbanProjectUpdatePage.expectSummaryLineValue(
      "Désimperméabilisation",
      asEuroAmount(UPDATED_DEIMPERMEABILIZATION_AMOUNT),
    );

    // --- Save in place ---
    await urbanProjectUpdatePage.submitFinalSummary();
    await urbanProjectUpdatePage.expectSaveSuccess();

    // --- Reopening the update page confirms both edits were actually persisted ---
    await urbanProjectUpdatePage.goto(fricheUrbanProject.id);
    await urbanProjectUpdatePage.expectFinalSummary();
    await urbanProjectUpdatePage.expectSummaryLineValue(
      "Logements",
      asSquareMeters(UPDATED_RESIDENTIAL_FLOOR_AREA),
    );
    await urbanProjectUpdatePage.expectSummaryLineValue(
      "Désimperméabilisation",
      asEuroAmount(UPDATED_DEIMPERMEABILIZATION_AMOUNT),
    );
  });
});
