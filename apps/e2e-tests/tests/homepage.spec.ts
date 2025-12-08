import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("displays the correct title", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(
      "Bénéfriches, l'outil qui calcule la valeur réelle de votre projet d'aménagement",
    );
  });
});
