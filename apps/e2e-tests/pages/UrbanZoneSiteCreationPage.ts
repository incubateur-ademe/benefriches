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
 * - Phase 6.5: passExpensesAndIncomeIntroduction, fillActivityParkManagerExpenses,
 *              passExpensesAndIncomeSummary, fillLocalAuthorityExpenses
 * - Phase 7: fillSiteNameAndDescription, expectFinalSummary, createSite, expectCreationSuccess
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
    await this.page.getByRole("radio", { name: "㎡" }).check({ force: true });

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
    // Switch to m² input mode
    await this.page.getByRole("radio", { name: "㎡" }).check({ force: true });
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

  // --- Phase 6.5: expenses and income ---

  async fillActivityParkManagerExpenses(values: {
    vacantPremisesExpenses?: {
      ownerPropertyTaxes?: number;
      ownerMaintenance?: number;
      ownerSecurity?: number;
      ownerIllegalDumpingCost?: number;
      ownerOtherManagementCosts?: number;
      tenantRent?: number;
      tenantOperationsTaxes?: number;
      tenantOtherOperationsCosts?: number;
    };
    zoneManagementExpenses?: {
      maintenance?: number;
      security?: number;
      illegalDumpingCost?: number;
      otherManagementCosts?: number;
    };
    zoneManagementIncome?: {
      rent?: number;
      subsidies?: number;
      otherIncome?: number;
    };
  }): Promise<void> {
    // Vacant premises expenses form — only shown when hasVacantPremises
    if (values.vacantPremisesExpenses !== undefined) {
      const v = values.vacantPremisesExpenses;
      if (v.ownerPropertyTaxes !== undefined)
        await this.page
          .getByRole("textbox", { name: "Taxe foncière" })
          .first()
          .fill(v.ownerPropertyTaxes.toString());
      if (v.ownerMaintenance !== undefined)
        await this.page
          .getByRole("textbox", { name: "Entretien et maintenance" })
          .first()
          .fill(v.ownerMaintenance.toString());
      if (v.ownerSecurity !== undefined)
        await this.page
          .getByRole("textbox", { name: "Gardiennage" })
          .fill(v.ownerSecurity.toString());
      if (v.ownerIllegalDumpingCost !== undefined)
        await this.page
          .getByRole("textbox", { name: "Débarras de dépôt sauvage" })
          .first()
          .fill(v.ownerIllegalDumpingCost.toString());
      if (v.ownerOtherManagementCosts !== undefined)
        await this.page
          .getByRole("textbox", { name: "Autres charges" })
          .first()
          .fill(v.ownerOtherManagementCosts.toString());
      if (v.tenantRent !== undefined)
        await this.page.getByRole("textbox", { name: "Loyer" }).fill(v.tenantRent.toString());
      if (v.tenantOperationsTaxes !== undefined)
        await this.page
          .getByRole("textbox", { name: "Impôts et taxes" })
          .fill(v.tenantOperationsTaxes.toString());
      if (v.tenantOtherOperationsCosts !== undefined)
        await this.page
          .getByRole("textbox", { name: "Autres charges" })
          .last()
          .fill(v.tenantOtherOperationsCosts.toString());
      await this.submit();
    }

    // Zone management expenses form — only shown when hasActivity
    if (values.zoneManagementExpenses !== undefined) {
      const v = values.zoneManagementExpenses;
      if (v.maintenance !== undefined)
        await this.page
          .getByRole("textbox", { name: "Entretien et maintenance" })
          .fill(v.maintenance.toString());
      if (v.security !== undefined)
        await this.page.getByRole("textbox", { name: "Gardiennage" }).fill(v.security.toString());
      if (v.illegalDumpingCost !== undefined)
        await this.page
          .getByRole("textbox", { name: "Débarras de dépôt sauvage" })
          .fill(v.illegalDumpingCost.toString());
      if (v.otherManagementCosts !== undefined)
        await this.page
          .getByRole("textbox", { name: "Autres charges" })
          .fill(v.otherManagementCosts.toString());
      await this.submit();
    }

    // Zone management income form — only shown when hasActivity
    if (values.zoneManagementIncome !== undefined) {
      const v = values.zoneManagementIncome;
      if (v.rent !== undefined)
        await this.page.getByRole("textbox", { name: "Revenus locatifs" }).fill(v.rent.toString());
      if (v.subsidies !== undefined)
        await this.page.getByRole("textbox", { name: "Subventions" }).fill(v.subsidies.toString());
      if (v.otherIncome !== undefined)
        await this.page
          .getByRole("textbox", { name: "Autres recettes" })
          .fill(v.otherIncome.toString());
      await this.submit();
    }
  }

  async passExpensesAndIncomeSummary(): Promise<void> {
    await this.page.getByRole("button", { name: "Suivant" }).click();
  }

  async fillLocalAuthorityExpenses(values: {
    maintenance?: number;
    otherManagementCosts?: number;
  }): Promise<void> {
    if (values.maintenance !== undefined)
      await this.page
        .getByRole("textbox", { name: "Entretien et maintenance" })
        .fill(values.maintenance.toString());
    if (values.otherManagementCosts !== undefined)
      await this.page
        .getByRole("textbox", { name: "Autres charges" })
        .fill(values.otherManagementCosts.toString());
    await this.submit();
  }

  // --- Phase 7: naming + summary ---
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
