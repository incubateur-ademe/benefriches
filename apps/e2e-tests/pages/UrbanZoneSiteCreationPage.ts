import { expect, type Page } from "@playwright/test";
import type { SoilType, UrbanZoneLandParcelType, UrbanZoneType } from "shared";

/**
 * Page object for urban zone site creation steps.
 * Covers steps from URBAN_ZONE_TYPE onward (after the shared intro/isFriche/siteNature steps
 * handled by SiteCreationPage).
 *
 * Methods are added phase by phase as the wizard is implemented:
 * - Phase 2: selectUrbanZoneType
 * - Phase 3: selectLandParcels, fillLandParcelsSurfaceDistribution
 * - Phase 4: selectSoilsForCurrentParcel, fillSoilsDistributionForCurrentParcel,
 *            fillBuildingsFloorAreaForCurrentParcel
 * - Phase 5: selectSoilsContamination, selectManager, fillVacantCommercialPremisesFootprint,
 *            fillVacantCommercialPremisesFloorArea, fillFullTimeJobsEquivalent
 * - Phase 6: fillSiteNameAndDescription, expectFinalSummary, createSite, expectCreationSuccess
 */
export class UrbanZoneSiteCreationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // --- Phase 2 ---

  async selectUrbanZoneType(type: UrbanZoneType): Promise<void> {
    const labels: Record<UrbanZoneType, string> = {
      ECONOMIC_ACTIVITY_ZONE: "Zone d'activités économiques",
      RESIDENTIAL_ZONE: "Zone d'habitation",
      PUBLIC_FACILITY: "Équipement public",
      MIXED_URBAN_ZONE: "Zone urbaine mixte",
    };
    await this.page.getByLabel(labels[type]).first().check({ force: true });
    await this.submit();
  }

  // --- Phase 3 ---

  async selectLandParcels(types: UrbanZoneLandParcelType[]): Promise<void> {
    const labels: Record<UrbanZoneLandParcelType, string> = {
      COMMERCIAL_ACTIVITY_AREA: "Surface d'activité",
      PUBLIC_SPACES: "Espaces publics",
      SERVICED_SURFACE: "Surface viabilisée",
      RESERVED_SURFACE: "Surface réservée",
    };
    for (const type of types) {
      await this.page.getByLabel(labels[type]).check({ force: true });
    }
    await this.submit();
  }

  async fillLandParcelsSurfaceDistribution(
    distribution: Partial<Record<UrbanZoneLandParcelType, number>>,
  ): Promise<void> {
    const labels: Record<UrbanZoneLandParcelType, string> = {
      COMMERCIAL_ACTIVITY_AREA: "Surface d'activité",
      PUBLIC_SPACES: "Espaces publics",
      SERVICED_SURFACE: "Surface viabilisée",
      RESERVED_SURFACE: "Surface réservée",
    };
    // Switch to m² input mode (defaults to %)
    await this.page.getByLabel("㎡").check({ force: true });

    for (const [type, area] of Object.entries(distribution) as [
      UrbanZoneLandParcelType,
      number,
    ][]) {
      await this.page.getByRole("textbox", { name: labels[type] }).fill(area.toString());
    }
    await this.submit();
  }

  // --- Phase 4 ---

  async selectSoilsForCurrentParcel(soilTypes: SoilType[]): Promise<void> {
    const labels: Record<SoilType, string> = {
      BUILDINGS: "Bâtiments",
      IMPERMEABLE_SOILS: "Aire bitumée, bétonnée ou pavée",
      MINERAL_SOIL: "Aire en gravier, semi-perméable ou sol nu",
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: "Pelouse et buissons",
      ARTIFICIAL_TREE_FILLED: "Espace arboré",
      PRAIRIE_GRASS: "Prairie herbacée",
      PRAIRIE_BUSHES: "Prairie arbustive",
      PRAIRIE_TREES: "Prairie arborée",
      CULTIVATION: "Culture",
      VINEYARD: "Vigne",
      ORCHARD: "Verger",
      FOREST_DECIDUOUS: "Forêt de feuillus",
      FOREST_CONIFER: "Forêt de conifères",
      FOREST_POPLAR: "Forêt de peupliers",
      FOREST_MIXED: "Forêt mixte",
      WET_LAND: "Zone humide",
      WATER: "Plan d'eau",
    };
    for (const soilType of soilTypes) {
      await this.page.getByLabel(labels[soilType]).check({ force: true });
    }
    await this.submit();
  }

  async fillSoilsDistributionForCurrentParcel(
    distribution: Partial<Record<SoilType, number>>,
  ): Promise<void> {
    const labels: Record<SoilType, string> = {
      BUILDINGS: "Bâtiments",
      IMPERMEABLE_SOILS: "Sols imperméabilisés",
      MINERAL_SOIL: "Sols perméables minéraux",
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: "Sols enherbés et arbustifs",
      ARTIFICIAL_TREE_FILLED: "Sol arboré",
      PRAIRIE_GRASS: "Prairie herbacée",
      PRAIRIE_BUSHES: "Prairie arbustive",
      PRAIRIE_TREES: "Prairie arborée",
      CULTIVATION: "Culture",
      VINEYARD: "Vigne",
      ORCHARD: "Verger",
      FOREST_DECIDUOUS: "Forêt de feuillus",
      FOREST_CONIFER: "Forêt de conifères",
      FOREST_POPLAR: "Forêt de peupliers",
      FOREST_MIXED: "Forêt mixte",
      WET_LAND: "Zone humide",
      WATER: "Plan d'eau",
    };
    for (const [soilType, area] of Object.entries(distribution) as [SoilType, number][]) {
      await this.page.getByRole("textbox", { name: labels[soilType] }).fill(area.toString());
    }
    await this.submit();
  }

  async fillBuildingsFloorAreaForCurrentParcel(floorArea: number): Promise<void> {
    await this.page
      .getByRole("textbox", { name: /surface de plancher/i })
      .fill(floorArea.toString());
    await this.submit();
  }

  // --- Phase 5: contamination ---

  async selectSoilsContamination(value: "yes" | "no", contaminatedSurface?: number): Promise<void> {
    const label = value === "yes" ? "Oui" : "Non / Ne sait pas";
    await this.page.getByRole("radio", { name: label, exact: true }).check({ force: true });
    if (value === "yes" && contaminatedSurface !== undefined) {
      await this.page.getByLabel("Superficie polluée").fill(contaminatedSurface.toString());
    }
    await this.submit();
  }

  // --- Phase 5: management ---

  async selectManager(type: "activity_park_manager" | "local_authority"): Promise<void> {
    const labels: Record<typeof type, string> = {
      activity_park_manager: "Un gestionnaire de parc d'activité",
      local_authority: "La collectivité",
    };
    await this.page.getByRole("radio", { name: labels[type] }).check({ force: true });
    await this.submit();
  }

  async fillVacantCommercialPremisesFootprint(area: number): Promise<void> {
    await this.page.getByRole("textbox", { name: /emprise foncière/i }).fill(area.toString());
    await this.submit();
  }

  async fillVacantCommercialPremisesFloorArea(area: number): Promise<void> {
    await this.page.getByRole("textbox", { name: /surface de plancher/i }).fill(area.toString());
    await this.submit();
  }

  async fillFullTimeJobsEquivalent(fte: number): Promise<void> {
    await this.page.getByRole("textbox", { name: /emplois/i }).fill(fte.toString());
    await this.submit();
  }

  // --- Phase 6: naming + summary ---
  async fillSiteNameAndDescription(name: string, description?: string): Promise<void> {
    await this.page.getByLabel("Nom du site").fill(name);
    if (description) {
      await this.page.getByLabel("Descriptif du site").fill(description);
    }
    await this.submit();
  }

  async expectFinalSummary(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Récapitulatif du site" })).toBeVisible();
  }

  async createSite(): Promise<void> {
    await this.page.getByRole("button", { name: "Suivant" }).click();
  }

  async expectCreationSuccess(siteName: string): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: `Le site « ${siteName} » est créé` }),
    ).toBeVisible();
  }

  async goToNextStep(): Promise<void> {
    await this.page.getByRole("button", { name: "Suivant" }).click();
  }

  private async submit(): Promise<void> {
    await this.page.getByRole("button", { name: /Valider|Suivant/ }).click();
  }
}
