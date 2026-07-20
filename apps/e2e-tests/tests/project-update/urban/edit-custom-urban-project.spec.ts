import { asEuroAmount, asSquareMeters } from "../../../fixtures/helpers/format.helpers";
import { expect, test } from "./fixtures";

const ORIGINAL_RESIDENTIAL_FLOOR_AREA = 250;
const UPDATED_RESIDENTIAL_FLOOR_AREA = 800;
const UPDATED_MAINTENANCE_EXPENSE_AMOUNT = 5000;

test.describe("urban project editing", () => {
  test("allows a user to reach urban-project update from Mes évaluations, edit a parameter via a summary section link, then edit an expense via the sidebar, and save in place", async ({
    myEvaluationsPage,
    urbanProjectUpdatePage,
    urbanProject,
    authenticatedPage,
  }) => {
    // --- Reach the update form from the project card's menu ---
    await myEvaluationsPage.goto();
    await myEvaluationsPage.clickModifierForProject(urbanProject.name);

    await expect(authenticatedPage).toHaveURL(
      new RegExp(`/mes-projets/${urbanProject.id}/modifier`),
    );
    await urbanProjectUpdatePage.expectFinalSummary();
    await urbanProjectUpdatePage.expectUpdatePageTitle(urbanProject.name);

    await urbanProjectUpdatePage.expectSummaryLineValue(
      "Logements",
      asSquareMeters(ORIGINAL_RESIDENTIAL_FLOOR_AREA),
    );

    // --- Edit floor surface area via the summary section's "Modifier" link ---
    await urbanProjectUpdatePage.clickEditSection(/Bâtiments/);
    await urbanProjectUpdatePage.expectStepTitle(
      /Quelle surface de plancher feront les différents usages/,
    );

    // Only "Logements" is being changed — the other uses already show their saved value (250),
    await expect(authenticatedPage.getByRole("textbox", { name: "Logements" })).toHaveValue("250");
    await expect(authenticatedPage.getByRole("textbox", { name: "Commerces" })).toHaveValue("250");
    await expect(
      authenticatedPage.getByRole("textbox", {
        name: "Locaux artisanaux, industriels ou de stockage",
      }),
    ).toHaveValue("250");
    await expect(authenticatedPage.getByRole("textbox", { name: "Parking silo" })).toHaveValue(
      "250",
    );

    await urbanProjectUpdatePage.fillUsesFloorSurfaceArea({
      Logements: UPDATED_RESIDENTIAL_FLOOR_AREA,
    });

    await urbanProjectUpdatePage.expectFinalSummary();
    await urbanProjectUpdatePage.expectSummaryLineValue(
      "Logements",
      asSquareMeters(UPDATED_RESIDENTIAL_FLOOR_AREA),
    );

    // --- Edit an expense via the sidebar navigation ---
    await urbanProjectUpdatePage.selectSidebarGroup("Dépenses");
    await urbanProjectUpdatePage.selectSidebarSubStep("Exploitation des bâtiments");

    await expect(
      authenticatedPage.getByRole("heading", {
        name: "Dépenses annuelles d'exploitation des bâtiments",
      }),
    ).toBeVisible();

    await urbanProjectUpdatePage.fillBuildingsOperatingExpenseAmount(
      "maintenance",
      UPDATED_MAINTENANCE_EXPENSE_AMOUNT,
    );

    // --- Both edits (different navigation paths) survived ---
    await urbanProjectUpdatePage.expectFinalSummary();
    await urbanProjectUpdatePage.expectSummaryLineValue(
      "Logements",
      asSquareMeters(UPDATED_RESIDENTIAL_FLOOR_AREA),
    );
    await urbanProjectUpdatePage.expectSummaryLineValue(
      "Maintenance",
      asEuroAmount(UPDATED_MAINTENANCE_EXPENSE_AMOUNT),
    );

    // --- Save in place ---
    await urbanProjectUpdatePage.submitFinalSummary();
    await urbanProjectUpdatePage.expectSaveSuccess();

    // --- Reopening the update page confirms both edits were actually persisted ---
    await urbanProjectUpdatePage.goto(urbanProject.id);
    await urbanProjectUpdatePage.expectFinalSummary();
    await urbanProjectUpdatePage.expectSummaryLineValue(
      "Logements",
      asSquareMeters(UPDATED_RESIDENTIAL_FLOOR_AREA),
    );
    await urbanProjectUpdatePage.expectSummaryLineValue(
      "Maintenance",
      asEuroAmount(UPDATED_MAINTENANCE_EXPENSE_AMOUNT),
    );
  });
});
