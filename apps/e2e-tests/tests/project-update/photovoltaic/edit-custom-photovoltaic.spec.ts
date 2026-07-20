import { asEuroAmount, asKiloWattsCrete } from "../../../fixtures/helpers/format.helpers";
import {
  ORIGINAL_ELECTRICAL_POWER_KWC,
  ORIGINAL_MAINTENANCE_EXPENSE_AMOUNT,
  expect,
  test,
} from "./fixtures";

const UPDATED_SITE_PURCHASE_SELLING_PRICE = 200_000;

test.describe("photovoltaic project editing", () => {
  test("allows a user to reach photovoltaic-project update from Mes évaluations, navigate via the sidebar, edit a parameter, and save in place", async ({
    myEvaluationsPage,
    pvProjectUpdatePage,
    photovoltaicProject,
    authenticatedPage,
  }) => {
    // --- Reach the update form from the project card's menu ---
    await myEvaluationsPage.goto();
    await myEvaluationsPage.clickModifierForProject(photovoltaicProject.name);

    await expect(authenticatedPage).toHaveURL(
      new RegExp(`/mes-projets/${photovoltaicProject.id}/modifier`),
    );
    await pvProjectUpdatePage.expectFinalSummary();
    await pvProjectUpdatePage.expectUpdatePageTitle(photovoltaicProject.name);

    await pvProjectUpdatePage.expectSummaryLineValue(
      "Puissance d'installation",
      asKiloWattsCrete(ORIGINAL_ELECTRICAL_POWER_KWC),
    );
    await pvProjectUpdatePage.expectSummaryLineValue(
      "Maintenance",
      asEuroAmount(ORIGINAL_MAINTENANCE_EXPENSE_AMOUNT),
    );

    // --- Navigate to a different section via the sidebar and edit a value there ---
    await pvProjectUpdatePage.selectSidebarStep("Dépenses et recettes");
    await pvProjectUpdatePage.expectStepTitle(/Montant de l'acquisition foncière/);

    await pvProjectUpdatePage.fillSitePurchaseSellingPrice(UPDATED_SITE_PURCHASE_SELLING_PRICE);
    // The remaining not-yet-answered step in the walked sequence is the future-operator
    // question, on the way back to the final summary.
    await pvProjectUpdatePage.selectStakeholder("Ma structure, ADEME");

    // --- The sidebar edit survived and other answers (power, maintenance) were untouched ---
    await pvProjectUpdatePage.expectFinalSummary();
    await pvProjectUpdatePage.expectSummaryLineValue(
      "Puissance d'installation",
      asKiloWattsCrete(ORIGINAL_ELECTRICAL_POWER_KWC),
    );
    await pvProjectUpdatePage.expectSummaryLineValue(
      "Maintenance",
      asEuroAmount(ORIGINAL_MAINTENANCE_EXPENSE_AMOUNT),
    );
    await pvProjectUpdatePage.expectSummaryLineValue(
      "Prix de vente du site et droits de mutation",
      asEuroAmount(UPDATED_SITE_PURCHASE_SELLING_PRICE + 11620),
    );

    // --- Save in place ---
    await pvProjectUpdatePage.submitFinalSummary();
    await pvProjectUpdatePage.expectSaveSuccess();

    // --- Reopening the update page confirms the edit was actually persisted ---
    await pvProjectUpdatePage.goto(photovoltaicProject.id);
    await pvProjectUpdatePage.expectFinalSummary();
    await pvProjectUpdatePage.expectSummaryLineValue(
      "Prix de vente du site et droits de mutation",
      asEuroAmount(UPDATED_SITE_PURCHASE_SELLING_PRICE + 11620),
    );
  });
});
