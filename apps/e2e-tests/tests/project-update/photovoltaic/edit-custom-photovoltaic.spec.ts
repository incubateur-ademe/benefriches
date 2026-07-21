import { asEuroAmount, asKiloWattsCrete } from "../../../fixtures/helpers/format.helpers";
import {
  ORIGINAL_ELECTRICAL_POWER_KWC,
  ORIGINAL_MAINTENANCE_EXPENSE_AMOUNT,
  PHOTOVOLTAIC_PROJECT_NAME,
  expect,
  test,
} from "./fixtures";

const UPDATED_PROJECT_NAME = "Centrale photovoltaïque de Meylan (agrandie)";
const UPDATED_SITE_PURCHASE_SELLING_PRICE = 200_000;

test.describe("photovoltaic project editing", () => {
  test("allows a user to reach photovoltaic-project update from Mes évaluations, edit the name via a summary section link, then edit a value via the sidebar, and save in place", async ({
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

    // --- Edit the project name via the summary section's "Modifier" link ---
    await pvProjectUpdatePage.clickEditSection(/Dénomination/);
    await expect(authenticatedPage.getByLabel(/Nom du projet/i)).toHaveValue(
      PHOTOVOLTAIC_PROJECT_NAME,
    );

    await pvProjectUpdatePage.fillNameAndDescription(UPDATED_PROJECT_NAME);
    // The saved project never answered the future-operator question — every walk forward
    // through the sequence passes through it once before reaching the final summary.
    await pvProjectUpdatePage.selectStakeholder("Ma structure, ADEME");

    await pvProjectUpdatePage.expectFinalSummary();
    await pvProjectUpdatePage.expectSummaryLineValue("Nom du projet", UPDATED_PROJECT_NAME);

    // --- Navigate to a different section via the sidebar and edit a value there ---
    await pvProjectUpdatePage.selectSidebarStep("Dépenses et recettes");
    await pvProjectUpdatePage.expectStepTitle(/Montant de l'acquisition foncière/);

    await pvProjectUpdatePage.fillSitePurchaseSellingPrice(UPDATED_SITE_PURCHASE_SELLING_PRICE);

    // --- Both edits (different navigation paths) survived and other answers were untouched ---
    await pvProjectUpdatePage.expectFinalSummary();
    await pvProjectUpdatePage.expectSummaryLineValue("Nom du projet", UPDATED_PROJECT_NAME);
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

    // --- Reopening the update page confirms both edits were actually persisted ---
    await pvProjectUpdatePage.goto(photovoltaicProject.id);
    await pvProjectUpdatePage.expectFinalSummary();
    await pvProjectUpdatePage.expectUpdatePageTitle(UPDATED_PROJECT_NAME);
    await pvProjectUpdatePage.expectSummaryLineValue(
      "Prix de vente du site et droits de mutation",
      asEuroAmount(UPDATED_SITE_PURCHASE_SELLING_PRICE + 11620),
    );
  });
});
