import { asSquareMeters } from "../../../fixtures/helpers/format.helpers";
import { expect, test } from "../fixtures";

const UPDATED_SITE_NAME = "ZAE de Meylan (agrandie)";
const UPDATED_FOOTPRINT = 1_800;

test.describe("site update - urban zone", () => {
  test("allows a user to edit a custom urban-zone site and keeps every untouched answer", async ({
    siteUpdatePage,
    urbanZoneSiteCreationPage,
    urbanZoneSite,
    authenticatedPage,
  }) => {
    await siteUpdatePage.goto(urbanZoneSite.id);
    await siteUpdatePage.expectUpdatePageTitle(urbanZoneSite.name);
    await siteUpdatePage.expectFinalSummary();
    await siteUpdatePage.expectWizardAriaSnapshot("urban-zone-update-final-summary-step.aria.yml");

    // --- Hydration: the wizard opens fully answered with the seeded values ---
    await siteUpdatePage.expectSummaryLineValue(
      "Type de zone urbaine",
      "Zone d'activités économiques",
    );
    await siteUpdatePage.expectSummaryLineValue("Superficie totale", asSquareMeters(10_000));
    await siteUpdatePage.expectSummaryLineValue("Gestionnaire", "Mairie de Meylan");
    await siteUpdatePage.expectSummaryLineValue(
      "Emprise des locaux vacants",
      asSquareMeters(1_200),
    );
    await siteUpdatePage.expectSummaryLineValue(
      "Surface de plancher des locaux vacants",
      asSquareMeters(900),
    );
    await siteUpdatePage.expectSummaryLineValue("Emplois en équivalent temps plein", "25");
    await siteUpdatePage.expectSummaryLineValue("Nom du site", urbanZoneSite.name);
    // Merged soils, summed across both seeded land parcels.
    await siteUpdatePage.expectSummaryLineValue("Bâtiments", asSquareMeters(4_000));
    await siteUpdatePage.expectSummaryLineValue("Sols imperméabilisés", asSquareMeters(2_000));
    await siteUpdatePage.expectSummaryLineValue("Sols perméables minéraux", asSquareMeters(2_500));
    await siteUpdatePage.expectSummaryLineValue(
      "Sols enherbés et arbustifs",
      asSquareMeters(1_500),
    );

    // --- Edit the site name via the summary section's "Modifier" link (ticket 15) ---
    await siteUpdatePage.clickEditSection(/Dénomination/);
    await siteUpdatePage.expectStepTitle("Dénomination du site");
    await expect(authenticatedPage.getByLabel("Nom du site")).toHaveValue(urbanZoneSite.name);
    await authenticatedPage.getByLabel("Nom du site").fill(UPDATED_SITE_NAME);
    await authenticatedPage.getByRole("button", { name: "Valider" }).click();

    await siteUpdatePage.expectFinalSummary();
    await siteUpdatePage.expectSummaryLineValue("Nom du site", UPDATED_SITE_NAME);

    // --- Navigate to the management group via the sidebar and walk it step by step ---
    await siteUpdatePage.selectSidebarStep("Gestion et activité");
    await siteUpdatePage.expectStepTitle("Qui est le gestionnaire de la zone commerciale ?");
    await authenticatedPage.getByRole("button", { name: "Valider" }).click();

    await siteUpdatePage.expectStepTitle(
      "Quelle est l'emprise foncière des locaux commerciaux vacants ou en friche ?",
    );
    await expect(authenticatedPage.getByRole("textbox", { name: /emprise foncière/i })).toHaveValue(
      "1200",
    );
    await urbanZoneSiteCreationPage.fillVacantCommercialPremisesFootprint(UPDATED_FOOTPRINT);

    await siteUpdatePage.expectStepTitle(
      "Quelle est la surface de plancher des locaux commerciaux vacants ou en friche ?",
    );
    await authenticatedPage.getByRole("button", { name: "Valider" }).click();

    await siteUpdatePage.expectStepTitle(
      "Combien y a t-il d'emplois équivalents temps plein dans la zone d'activité commerciale ?",
    );
    await authenticatedPage.getByRole("button", { name: "Valider" }).click();

    // --- Back on the summary: the new footprint, plus every untouched answer, survived ---
    await siteUpdatePage.expectFinalSummary();
    await siteUpdatePage.expectSummaryLineValue("Nom du site", UPDATED_SITE_NAME);
    await siteUpdatePage.expectSummaryLineValue(
      "Emprise des locaux vacants",
      asSquareMeters(UPDATED_FOOTPRINT),
    );
    await siteUpdatePage.expectSummaryLineValue(
      "Surface de plancher des locaux vacants",
      asSquareMeters(900),
    );
    await siteUpdatePage.expectSummaryLineValue("Emplois en équivalent temps plein", "25");
    await siteUpdatePage.expectSummaryLineValue("Gestionnaire", "Mairie de Meylan");
    await siteUpdatePage.expectSummaryLineValue("Bâtiments", asSquareMeters(4_000));
    await siteUpdatePage.expectSummaryLineValue("Sols imperméabilisés", asSquareMeters(2_000));
    await siteUpdatePage.expectSummaryLineValue("Sols perméables minéraux", asSquareMeters(2_500));
    await siteUpdatePage.expectSummaryLineValue(
      "Sols enherbés et arbustifs",
      asSquareMeters(1_500),
    );

    // --- Save in place ---
    await siteUpdatePage.clickSave();
    await siteUpdatePage.expectSaveSuccess();

    // --- Reopening the update page confirms every change was actually persisted ---
    await siteUpdatePage.goto(urbanZoneSite.id);
    await siteUpdatePage.expectUpdatePageTitle(UPDATED_SITE_NAME);
    await siteUpdatePage.expectFinalSummary();
    await siteUpdatePage.expectSummaryLineValue("Nom du site", UPDATED_SITE_NAME);
    await siteUpdatePage.expectSummaryLineValue(
      "Emprise des locaux vacants",
      asSquareMeters(UPDATED_FOOTPRINT),
    );
    await siteUpdatePage.expectSummaryLineValue("Gestionnaire", "Mairie de Meylan");
    await siteUpdatePage.expectSummaryLineValue("Bâtiments", asSquareMeters(4_000));
  });
});
