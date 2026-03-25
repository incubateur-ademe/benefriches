import { expect, type Page } from "@playwright/test";

export class SiteFeaturesPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectCurrentPage(): Promise<void> {
    await expect(this.page).toHaveURL((url) =>
      /\/sites\/[^/]+\/caracteristiques$/.test(url.pathname),
    );
  }

  async expectSiteHeading(siteName: string): Promise<void> {
    await expect(this.page.getByRole("heading", { name: siteName })).toBeVisible();
  }

  async expectFeaturesDataLines(expectedDataList: [label: string, value: string][]): Promise<void> {
    for (const [label, value] of expectedDataList) {
      // Use case-sensitive regex to avoid matching tooltip text that may contain lowercase variants
      // e.g. "Bâtiments" label should not match tooltip text containing "bâtiments"
      const labelRegex = new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      await expect(
        this.page
          .locator("dl")
          .filter({ has: this.page.locator("dd", { hasText: labelRegex }) })
          .locator("dt"),
      ).toHaveText(value);
    }
  }
}
