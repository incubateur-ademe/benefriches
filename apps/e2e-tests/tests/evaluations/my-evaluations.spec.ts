import { expect, test, testWithSites } from "./my-evaluations.fixtures";

test.describe("my Evaluations - Site List", () => {
  test("displays empty list for users with no evaluations", async ({ myEvaluationsPage }) => {
    await myEvaluationsPage.goto();

    await myEvaluationsPage.expectCurrentPage();
    await myEvaluationsPage.expectPageTitle();

    await myEvaluationsPage.expectEmptyList();

    await myEvaluationsPage.expectEvaluateFirstCustomSiteVisible();
    await myEvaluationsPage.expectEvaluateFirstExpressSiteVisible();
  });

  test("clicks on first custom site link leads to create custom site from", async ({
    myEvaluationsPage,
  }) => {
    await myEvaluationsPage.goto();

    await myEvaluationsPage.expectCurrentPage();
    await myEvaluationsPage.expectPageTitle();

    await myEvaluationsPage.clickEvaluateFirstCustomSiteLink();

    await expect(myEvaluationsPage.page).toHaveURL(
      (url) => url.pathname === "/creer-site-foncier/custom",
    );
    await expect(myEvaluationsPage.page).toHaveURL((url) => {
      const params = url.searchParams;
      return params.get("etape") === "introduction";
    });
    await expect(
      myEvaluationsPage.page.getByRole("heading", { name: "Tout commence sur un site." }),
    ).toBeVisible();
  });

  test("clicks on first demo site link leads to create demo site from", async ({
    myEvaluationsPage,
  }) => {
    await myEvaluationsPage.goto();

    await myEvaluationsPage.expectCurrentPage();
    await myEvaluationsPage.expectPageTitle();

    await myEvaluationsPage.clickEvaluateFirstExpressSiteLink();

    await expect(myEvaluationsPage.page).toHaveURL(
      (url) => url.pathname === "/creer-site-foncier/demo",
    );
    await expect(myEvaluationsPage.page).toHaveURL((url) => {
      const params = url.searchParams;
      return params.get("etape") === "demo-introduction";
    });
    await expect(
      myEvaluationsPage.page.getByRole("heading", {
        name: "Vous allez faire une évaluation demo d’impacts socio-économiques d’un projet sur un site.",
      }),
    ).toBeVisible();
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
      await myEvaluationsPage.expectEvaluateNewCustomSiteVisible();

      await myEvaluationsPage.expectSiteVisible("Friche ferroviaire de Segré");
      await myEvaluationsPage.expectSiteVisible("Friche ferroviaire de Blajan");
    },
  );

  testWithSites(
    "displays create new custom site button in header that leads to create-site custom form",
    async ({ myEvaluationsPage, testSites }) => {
      // testSites fixture creates the sites via API before the test runs
      void testSites;
      await myEvaluationsPage.goto();

      await myEvaluationsPage.expectCurrentPage();

      await myEvaluationsPage.expectEvaluateNewCustomSiteVisible();

      await myEvaluationsPage.clickEvaluateNewCustomSiteLink();

      await expect(myEvaluationsPage.page).toHaveURL(
        (url) => url.pathname === "/creer-site-foncier/custom",
      );
      await expect(myEvaluationsPage.page).toHaveURL((url) => {
        const params = url.searchParams;
        return params.get("etape") === "introduction";
      });
      await expect(
        myEvaluationsPage.page.getByRole("heading", { name: "Tout commence sur un site." }),
      ).toBeVisible();
    },
  );
});
