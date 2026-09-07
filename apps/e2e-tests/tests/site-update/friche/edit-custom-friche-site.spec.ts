import { asSquareMeters } from "../../../fixtures/helpers/format.helpers";
import { expect, test } from "../fixtures";

const UPDATED_SITE_NAME = "Friche industrielle de Meylan (rénovée)";

test.describe("site update - friche", () => {
  test("allows a user to reach site update from Mes évaluations, edit via a summary link and via the sidebar, save, and see the change persisted", async ({
    myEvaluationsPage,
    siteUpdatePage,
    siteCreationPage,
    fricheSite,
    authenticatedPage,
  }) => {
    // --- Reach the update wizard from the site card's menu ---
    await myEvaluationsPage.goto();
    await myEvaluationsPage.clickModifierForSite(fricheSite.name);

    await expect(authenticatedPage).toHaveURL(new RegExp(`/sites/${fricheSite.id}/modifier`));
    await siteUpdatePage.expectUpdatePageTitle(fricheSite.name);
    await siteUpdatePage.expectFinalSummary();
    await siteUpdatePage.expectWizardAriaSnapshot("friche-update-final-summary-step.aria.yml");

    // --- Hydration: the wizard opens fully answered with the seeded values ---
    await siteUpdatePage.expectSummaryLineValue(
      "Superficie totale du site",
      asSquareMeters(10_000),
    );
    await siteUpdatePage.expectSummaryLineValue("Superficie polluée", asSquareMeters(4_000));
    await siteUpdatePage.expectSummaryLineValue("Propriétaire actuel", "Mairie de Meylan");
    await siteUpdatePage.expectSummaryLineValue("Nom du site", fricheSite.name);

    // --- Save button is visible from the very first render ---
    await siteUpdatePage.expectSaveButtonVisible();

    // --- Edit via the summary section's "Modifier" link (ticket 15): the 📍 Localisation
    // section maps to a single step (ADDRESS), so its "Modifier" link opens it directly — unlike
    // the 📍 Dénomination section, which also covers the friche-activity step (pre-existing,
    // shared `getSummarySectionProps` behaviour: with every step already answered, "Modifier"
    // opens the section's first underlying step in `stepsSequence` order — here FRICHE_ACTIVITY,
    // whose own next step falls in a different stepper group, so completing it collapses
    // straight back to the summary instead of reaching NAMING; out of this ticket's scope to
    // change). Confirm it opens pre-filled, then submit unchanged (no commune change, so no
    // cascade) to prove the round-trip back to the summary works. ---
    await siteUpdatePage.clickEditSection(/Localisation/);
    await siteUpdatePage.expectStepTitle(/Où est située/);
    await expect(authenticatedPage.getByRole("searchbox")).toHaveValue(/Meylan/);
    await authenticatedPage.getByRole("button", { name: "Valider" }).click();

    await siteUpdatePage.expectFinalSummary();
    await siteUpdatePage.expectSummaryLineValue("Adresse du site", "Meylan");

    // --- Navigate to the naming step via the sidebar group and rename the site ---
    await siteUpdatePage.selectSidebarStep("Dénomination");
    await siteUpdatePage.expectStepTitle("Dénomination du site");
    await expect(authenticatedPage.getByLabel("Nom du site")).toHaveValue(fricheSite.name);

    await authenticatedPage.getByLabel("Nom du site").fill(UPDATED_SITE_NAME);
    await authenticatedPage.getByRole("button", { name: "Valider" }).click();

    await siteUpdatePage.expectFinalSummary();
    await siteUpdatePage.expectSummaryLineValue("Nom du site", UPDATED_SITE_NAME);

    // --- Navigate to the owner step via the sidebar group and confirm it opens pre-selected ---
    await siteUpdatePage.selectSidebarStep("Gestion du site");
    await siteUpdatePage.expectStepTitle(/propriétaire actuel/);
    await expect(authenticatedPage.getByRole("radio", { name: "Une collectivité" })).toBeChecked();
    // Wait for the city-specific local-authority label (not the generic "Mairie" placeholder
    // shown while fetchSiteMunicipalityData is in flight, see siteMunicipalityData.reducer.ts)
    // before snapshotting, so the aria baseline isn't racing that fetch.
    await expect(
      authenticatedPage
        .getByRole("combobox", { name: /type de collectivité/i })
        .locator("option[value='municipality']"),
    ).toHaveText("Mairie de Meylan", { timeout: 15000 });
    await siteUpdatePage.expectWizardAriaSnapshot("friche-update-owner-step.aria.yml");

    await authenticatedPage.getByRole("button", { name: "Valider" }).click();

    // --- Submitting OWNER lands on IS_FRICHE_LEASED, not straight back on the summary: entering
    // a fully-hydrated group mid-way still walks it step by step (applyStepChanges.ts's
    // `groupOf`-aware "same-group" navigation, `next_empty` mode) rather than collapsing early —
    // every remaining "Gestion du site" step below is untouched, pre-filled data being resubmitted
    // unchanged, proving the whole group round-trips intact. ---
    await siteUpdatePage.expectStepTitle(/La friche est-elle encore louée/);
    await siteCreationPage.selectIsFricheLeased("no");
    await siteUpdatePage.expectStepTitle(/dépenses/);
    await siteCreationPage.goToNextStep();
    await siteUpdatePage.expectStepTitle(/Dépenses annuelles/);
    await siteCreationPage.submitExpenses();
    await siteUpdatePage.expectStepTitle(/Récapitulatif des dépenses/);
    await siteCreationPage.goToNextStep();
    await siteUpdatePage.expectStepTitle(/identité de ce site/);
    await siteCreationPage.goToNextStep();
    await siteUpdatePage.expectStepTitle("Dénomination du site");
    await authenticatedPage.getByRole("button", { name: "Valider" }).click();

    // --- Both edits (different navigation paths) survived, other answers were untouched ---
    await siteUpdatePage.expectFinalSummary();
    await siteUpdatePage.expectSummaryLineValue("Nom du site", UPDATED_SITE_NAME);
    await siteUpdatePage.expectSummaryLineValue(
      "Superficie totale du site",
      asSquareMeters(10_000),
    );
    await siteUpdatePage.expectSummaryLineValue("Superficie polluée", asSquareMeters(4_000));
    await siteUpdatePage.expectSummaryLineValue("Propriétaire actuel", "Mairie de Meylan");

    // --- Save in place ---
    await siteUpdatePage.clickSave();
    await siteUpdatePage.expectSaveSuccess();

    // --- Reopening the update page confirms both edits were actually persisted ---
    await siteUpdatePage.goto(fricheSite.id);
    await siteUpdatePage.expectUpdatePageTitle(UPDATED_SITE_NAME);
    await siteUpdatePage.expectFinalSummary();
    await siteUpdatePage.expectSummaryLineValue("Nom du site", UPDATED_SITE_NAME);
    await siteUpdatePage.expectSummaryLineValue(
      "Superficie totale du site",
      asSquareMeters(10_000),
    );
    await siteUpdatePage.expectSummaryLineValue("Superficie polluée", asSquareMeters(4_000));
    await siteUpdatePage.expectSummaryLineValue("Propriétaire actuel", "Mairie de Meylan");
  });

  test("warns before leaving the update wizard with unsaved changes", async ({
    siteUpdatePage,
    fricheSite,
    authenticatedPage,
  }) => {
    await siteUpdatePage.goto(fricheSite.id);
    await siteUpdatePage.expectFinalSummary();

    // --- Make one edit through the sidebar ---
    // (See the main test above: the "Dénomination" summary section's "Modifier" link opens the
    // FRICHE_ACTIVITY step first, a pre-existing quirk out of this ticket's scope.)
    await siteUpdatePage.selectSidebarStep("Dénomination");
    await siteUpdatePage.expectStepTitle("Dénomination du site");
    await authenticatedPage.getByLabel("Nom du site").fill("Nom en cours d'édition");
    await authenticatedPage.getByRole("button", { name: "Valider" }).click();
    await siteUpdatePage.expectFinalSummary();
    await siteUpdatePage.expectSummaryLineValue("Nom du site", "Nom en cours d'édition");

    // --- Attempt to leave: the unsaved-changes dialog appears ---
    // A short, unavoidable wait: `useNavigationBlocker`'s own route-sync push (for the step
    // change just completed) is itself intercepted by the block it just armed, auto-confirmed as
    // an allowed same-wizard navigation, and the resulting re-subscribe is deliberately deferred
    // (~100ms, see its own doc comment) — clicking "go back" inside that window would race past
    // the block being armed. Not specific to this test: any navigation attempt immediately after
    // a step transition is subject to the same window.
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await authenticatedPage.waitForTimeout(150);
    await siteUpdatePage.clickGoBack();
    await siteUpdatePage.expectUnsavedChangesDialog();

    // --- Cancelling keeps the user on the wizard, edit intact ---
    await siteUpdatePage.cancelLeaving();
    await siteUpdatePage.expectNoUnsavedChangesDialog();
    await siteUpdatePage.expectFinalSummary();
    await siteUpdatePage.expectSummaryLineValue("Nom du site", "Nom en cours d'édition");

    // --- Confirming completes the navigation away from the wizard ---
    await siteUpdatePage.clickGoBack();
    await siteUpdatePage.expectUnsavedChangesDialog();
    await siteUpdatePage.confirmLeaving();
    await expect(authenticatedPage).not.toHaveURL(new RegExp(`/sites/${fricheSite.id}/modifier`));
  });
});
