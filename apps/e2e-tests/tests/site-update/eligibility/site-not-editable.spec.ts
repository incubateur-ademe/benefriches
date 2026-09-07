import { test } from "../fixtures";

test.describe("site update - eligibility", () => {
  test("shows the modify action disabled with its reason for a site carrying an active reconversion project", async ({
    myEvaluationsPage,
    siteFeaturesPage,
    siteUpdatePage,
    siteWithActiveProject,
    photovoltaicProject: _photovoltaicProject,
  }) => {
    const notEditableReason =
      /Ce site est utilisé par un ou plusieurs projets de reconversion\. Supprimez ces projets pour pouvoir modifier le site\./;

    // --- "Mes évaluations": the action is present but disabled, with its reason as real text ---
    await myEvaluationsPage.goto();
    await myEvaluationsPage.expectModifierDisabledForSite(
      siteWithActiveProject.name,
      notEditableReason,
    );

    // --- Same on the site page header menu ---
    await myEvaluationsPage.openSiteFeatures(siteWithActiveProject.name);
    await siteFeaturesPage.expectCurrentPage();
    await siteFeaturesPage.expectModifierDisabledForSite(notEditableReason);

    // --- Forcing the update route directly blocks the wizard from opening ---
    await siteUpdatePage.goto(siteWithActiveProject.id);
    await siteFeaturesPage.expectNotEditableAlert();
  });
});
