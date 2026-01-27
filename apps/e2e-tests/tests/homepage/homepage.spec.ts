import { test, expect } from "@playwright/test";

import { HomePage } from "../../pages/HomePage";

test.describe("homepage", () => {
  test("displays the correct title", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(page).toHaveTitle(
      "Bénéfriches, l'outil qui calcule la valeur réelle de votre projet d'aménagement",
    );
  });
});
