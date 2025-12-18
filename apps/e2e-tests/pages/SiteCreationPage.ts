import { expect, type Page } from "@playwright/test";
import type {
  SiteNature,
  FricheActivity,
  AgriculturalOperationActivity,
  NaturalAreaType,
} from "shared";
import { getLabelForAgriculturalOperationActivity, getLabelForNaturalAreaType } from "shared";

export type CreateMode = "express" | "custom";

// Labels for friche activity (matching the form's FRICHE_ACTIVITY_OPTIONS)
// These include extra text in parentheses that the shared label functions don't have
const FRICHE_ACTIVITY_LABELS: Record<FricheActivity, string> = {
  INDUSTRY: "Friche industrielle (usine, mine, carrière...)",
  MILITARY: "Friche militaire",
  RAILWAY: "Friche ferroviaire (voies ferrées, gare...)",
  PORT: "Friche portuaire (ports, chantiers navals...)",
  AGRICULTURE: "Friche agricole",
  TIP_OR_RECYCLING_SITE: "Ancienne décharge ou site de recyclage",
  BUILDING: "Ancien bâtiment (public, commercial ou d'habitation)",
  OTHER: "Autre",
};

export class SiteCreationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await this.page.goto("/creer-site-foncier");
  }

  async expectIntroductionStep(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: "Tout commence sur un site." }),
    ).toBeVisible();
  }

  async clickStart(): Promise<void> {
    await this.page.getByRole("button", { name: "Commencer" }).click();
  }

  async selectIsFriche(value: "yes" | "no"): Promise<void> {
    const label = value === "yes" ? "Oui" : "Non";

    await this.page.getByRole("radio", { name: label }).check({ force: true });
    await this.submit();
  }

  async selectWhatToEvaluate(value: "compatibility" | "impacts"): Promise<void> {
    // This form uses checkbox cards with images
    const text =
      value === "compatibility" ? "La compatibilité de ma friche" : "Les impacts socio-économiques";
    await this.page.getByLabel(text).check({ force: true });

    await this.submit();
  }

  async selectSiteNature(nature: SiteNature): Promise<void> {
    const labels: Record<SiteNature, string> = {
      FRICHE: "Friche", // Not used, since friche is selected via isFriche=yes
      AGRICULTURAL_OPERATION: "Exploitation agricole",
      NATURAL_AREA: "Espace naturel",
    };
    await this.page.getByLabel(labels[nature]).check({ force: true });

    await this.submit();
  }

  async selectCreateMode(mode: CreateMode): Promise<void> {
    const labels: Record<CreateMode, string> = {
      express: "Mode express",
      custom: "Mode personnalisé",
    };
    await this.page.getByLabel(labels[mode]).check({ force: true });

    await this.submit();
  }

  async selectFricheActivity(activity: FricheActivity): Promise<void> {
    const label = FRICHE_ACTIVITY_LABELS[activity];
    await this.page.getByRole("radio", { name: label }).check({ force: true });
    await this.submit();
  }

  async selectAgriculturalActivity(activity: AgriculturalOperationActivity): Promise<void> {
    const label = getLabelForAgriculturalOperationActivity(activity);
    await this.page.getByRole("radio", { name: label }).check({ force: true });
    await this.submit();
  }

  async selectNaturalAreaType(type: NaturalAreaType): Promise<void> {
    const label = getLabelForNaturalAreaType(type);
    await this.page.getByLabel(label).first().check({ force: true });
    await this.submit();
  }

  async fillAddress(municipality: string): Promise<void> {
    const searchInput = this.page.getByRole("searchbox", { name: /Commune ou code postal/i });
    // Use pressSequentially instead of fill() because HeadlessUI's ComboboxInput
    // tries to call setSelectionRange() on the DSFR Input wrapper instead of
    // the native input element, causing "setSelectionRange is not a function" error
    await searchInput.pressSequentially(municipality, { delay: 50 });

    // Wait for autocomplete suggestions to appear and select the first option
    const firstOption = this.page.getByRole("option").first();
    await firstOption.waitFor({ state: "visible", timeout: 10000 });
    await firstOption.click();

    await this.submit();
  }

  async fillSurfaceArea(area: number): Promise<void> {
    const input = this.page.getByRole("textbox", { name: "Superficie totale" });
    await input.fill(area.toString());
    await this.submit();
  }

  async expectCreationSuccess(siteName: string): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: `Le site « ${siteName} » est créé` }),
    ).toBeVisible();
  }

  async expectCreationSuccessWithDataInList(
    expectedDataList: [label: string, value: string][],
  ): Promise<void> {
    for (const [label, value] of expectedDataList) {
      await expect(this.page.locator("dl").filter({ hasText: label }).locator("dt")).toHaveText(
        value,
      );
    }
  }

  async expectExpressCreationDisclaimer(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: "Comment ont été affectées les" }),
    ).toBeVisible();
    await expect(
      this.page.getByText("Bénéfriches a automatiquement complété les caractéristiques"),
    ).toBeVisible();
  }

  async hideExpressCreationDisclaimer(): Promise<void> {
    await this.page.getByRole("checkbox", { name: "J'ai compris" }).check({ force: true });
    await this.page.getByRole("button", { name: "Masquer ce message" }).click();
    await expect(
      this.page.getByText("Bénéfriches a automatiquement complété les caractéristiques"),
    ).not.toBeVisible();
  }

  async expectCreateProjectLink() {
    await expect(
      this.page.getByRole("link", { name: "Renseigner mon projet sur ce site" }),
    ).toBeVisible();
  }

  private async submit(): Promise<void> {
    await this.page.getByRole("button", { name: /Valider|Suivant/ }).click();
  }
}
