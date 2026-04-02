import { getLabelForUrbanProjectCategory } from "../../../pages/urbanProjectCategoryLabels";
import { expect, test } from "./fixtures";

test.describe("photovoltaic project creation -  with mutability results in url", () => {
  test("displays projectSuggestions with compatibility score in instructions section of projectType form view", async ({
    pvProjectCreationPage,
    testSite,
  }) => {
    // Navigate to project creation
    await pvProjectCreationPage.gotoWithProjectSuggestions(testSite.id);

    // Project phase
    await pvProjectCreationPage.selectProjectPhase("Montage / Développement");

    // Create mode selection
    await pvProjectCreationPage.selectCreateMode("custom");

    await expect(
      pvProjectCreationPage.page
        .getByRole("listitem")
        .filter({ hasText: getLabelForUrbanProjectCategory("PUBLIC_FACILITIES") }),
    ).toHaveText(/.*Défavorable.*/);
    // Project type selection
    await pvProjectCreationPage.selectProjectType();
  });
});
