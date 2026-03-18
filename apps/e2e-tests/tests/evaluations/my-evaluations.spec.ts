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
      // testSites fixture creates the sites via API before the test runs
      void testSites;
      await myEvaluationsPage.goto();

      await myEvaluationsPage.expectCurrentPage();
      await myEvaluationsPage.expectPageTitle();

      await myEvaluationsPage.expectSitesListVisible();

      await myEvaluationsPage.expectSiteVisible("Friche ferroviaire de Segré");
      await myEvaluationsPage.expectSiteVisible("Friche ferroviaire de Blajan");
    },
  );
});
