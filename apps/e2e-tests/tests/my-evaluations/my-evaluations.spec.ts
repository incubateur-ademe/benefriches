import { test, testWithSites } from "./my-evaluations.fixtures";

test.describe("my Evaluations - Site List", () => {
  test("displays empty list for users with no evaluations", async ({ myEvaluationsPage }) => {
    await myEvaluationsPage.goto();

    await myEvaluationsPage.expectCurrentPage();
    await myEvaluationsPage.expectPageTitle();

    await myEvaluationsPage.expectEmptyList();
  });

  testWithSites(
    "displays created sites for user with express and custom sites",
    async ({ myEvaluationsPage, testSites }) => {
      await myEvaluationsPage.goto();

      await myEvaluationsPage.expectCurrentPage();
      await myEvaluationsPage.expectPageTitle();

      await myEvaluationsPage.expectSitesListVisible();

      // Verify both sites appear in the list
      for (const site of testSites) {
        await myEvaluationsPage.expectSiteVisible(site.name);
      }
    },
  );
});
