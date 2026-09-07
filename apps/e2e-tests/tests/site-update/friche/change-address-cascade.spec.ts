import { expect, test } from "../fixtures";

test.describe("site update - friche - address change cascade", () => {
  test("changing the site commune asks to confirm, resets the local-authority owner and refreshes municipality data", async ({
    siteUpdatePage,
    siteCreationPage,
    addressCascadeSite,
    authenticatedPage,
  }) => {
    await siteUpdatePage.goto(addressCascadeSite.id);
    await siteUpdatePage.expectFinalSummary();
    await siteUpdatePage.expectSummaryLineValue("Adresse du site", "Meylan");
    await siteUpdatePage.expectSummaryLineValue("Propriétaire actuel", "Mairie de Meylan");

    // --- Open the address step via the summary's "Modifier" link ---
    await siteUpdatePage.clickEditSection(/Localisation/);
    await siteUpdatePage.expectStepTitle(/Où est située/);
    await siteUpdatePage.expectNoCascadeDialog();

    // --- Changing the commune asks for confirmation before applying ---
    await siteCreationPage.fillAddress("Blajan");
    await siteUpdatePage.expectCascadeDialogListsStep("Gestion du site → Propriétaire");

    // --- Cancelling closes the dialog without applying the change: submitting the step is what
    // moves the wizard forward, so cancelling leaves it parked on the address step with nothing
    // written to the store yet ---
    await siteUpdatePage.cancelCascade();
    await siteUpdatePage.expectNoCascadeDialog();
    await siteUpdatePage.expectStepTitle(/Où est située/);

    // --- Resubmitting the SAME, unchanged commune completes the step normally (no cascade,
    // since the city didn't actually change) and returns to the summary — proving the cancelled
    // change above never took effect ---
    await siteCreationPage.fillAddress("Meylan");
    await siteUpdatePage.expectNoCascadeDialog();
    await siteUpdatePage.expectFinalSummary();
    await siteUpdatePage.expectSummaryLineValue("Adresse du site", "Meylan");
    await siteUpdatePage.expectSummaryLineValue("Propriétaire actuel", "Mairie de Meylan");

    // --- Redo and confirm this time ---
    await siteUpdatePage.clickEditSection(/Localisation/);
    await siteCreationPage.fillAddress("Blajan");
    await siteUpdatePage.expectCascadeDialogListsStep("Gestion du site → Propriétaire");
    await siteUpdatePage.confirmCascadeAndComplete();

    // --- Owner step is now blank, and offers the NEW commune's mairie: proof municipality
    // data was refetched, not left stale on the old commune ---
    await siteUpdatePage.expectStepTitle(/propriétaire actuel/);
    await authenticatedPage.getByRole("radio", { name: "Une collectivité" }).check({
      force: true,
    });
    const combobox = authenticatedPage.getByRole("combobox", { name: /type de collectivité/i });
    // Generous timeout: the label only becomes city-specific once fetchSiteMunicipalityData's
    // real network round-trip resolves (siteMunicipalityData.reducer.ts shows the generic
    // "Mairie" placeholder while it's in flight, by design) — the default 5s can be tight under
    // local Docker load.
    await expect(combobox.locator("option[value='municipality']")).toHaveText("Mairie de Blajan", {
      timeout: 15000,
    });
    await combobox.selectOption("municipality");
    await authenticatedPage.getByRole("button", { name: "Valider" }).click();

    // --- Submitting OWNER lands on IS_FRICHE_LEASED, not straight back on the summary: the rest
    // of "Gestion du site" is untouched by the cascade (only OWNER was invalidated) and gets
    // walked step by step, same-group navigation (see edit-custom-friche-site.spec.ts) — every
    // step below is pre-filled data being resubmitted unchanged. ---
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

    // --- Summary now shows the new address and the new owner ---
    await siteUpdatePage.expectFinalSummary();
    await siteUpdatePage.expectSummaryLineValue("Adresse du site", "Blajan");
    await siteUpdatePage.expectSummaryLineValue("Propriétaire actuel", "Mairie de Blajan");
  });
});
