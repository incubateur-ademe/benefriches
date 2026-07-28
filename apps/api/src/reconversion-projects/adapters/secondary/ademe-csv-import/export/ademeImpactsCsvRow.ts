import type { SocioEconomicImpact } from "shared";

import type { ComputedImpacts } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";

function findSocioEconomicImpact(
  impacts: SocioEconomicImpact[],
  impactName: string,
): SocioEconomicImpact | undefined {
  return impacts.find((i) => i.impact === impactName);
}

function getSocioEconomicAmount(impacts: SocioEconomicImpact[], impactName: string): number {
  const impact = findSocioEconomicImpact(impacts, impactName);
  return impact?.amount ?? 0;
}

function getEcosystemServiceDetail(impacts: SocioEconomicImpact[], detailName: string): number {
  const ecosystemServices = findSocioEconomicImpact(impacts, "ecosystem_services");
  if (!ecosystemServices || !("details" in ecosystemServices)) return 0;
  const detail = ecosystemServices.details.find((d) => d.impact === detailName);
  return detail?.amount ?? 0;
}

function getTaxesIncomeDetail(impacts: SocioEconomicImpact[], detailName: string): number {
  const taxesIncome = findSocioEconomicImpact(impacts, "taxes_income");
  if (!taxesIncome || !("details" in taxesIncome)) return 0;
  const detail = taxesIncome.details.find((d) => d.impact === detailName);
  return detail?.amount ?? 0;
}

function percentageDifference(base: number, forecast: number): string {
  if (base === 0) return forecast === 0 ? "0" : "";
  return String(((forecast - base) / Math.abs(base)) * 100);
}

export function escapeCsvValue(value: string | number): string {
  const str = String(value);
  if (str.includes(";") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * One property per exportable impact indicator, keyed by what the indicator describes rather
 * than by its column label or position. This is the single source of truth for how a value is
 * pulled out of the computed impacts — every export (ADEME, référentiel, ...) projects this
 * object into its own ordered column array instead of re-deriving these values.
 */
export type AdemeImpactFields = {
  fullTimeJobs: string;
  soilsCo2eqStorageBase: string;
  soilsCo2eqStorageForecast: string;
  soilsCo2eqStorageVariation: string;
  avoidedCo2eqEmissionsCarTraffic: string;
  permeableSurfaceAreaBase: string;
  permeableSurfaceAreaForecast: string;
  permeableSurfaceAreaVariation: string;
  contaminatedSurfaceAreaBase: string;
  contaminatedSurfaceAreaForecast: string;
  contaminatedSurfaceAreaDifference: string;
  ecosystemServicesTotal: string;
  ecosystemServiceNatureRelatedWellnessAndLeisure: string;
  ecosystemServiceForestRelatedProduct: string;
  ecosystemServicePollination: string;
  ecosystemServiceInvasiveSpeciesRegulation: string;
  ecosystemServiceWaterCycle: string;
  ecosystemServiceNitrogenCycle: string;
  ecosystemServiceSoilErosion: string;
  ecosystemServiceSoilsCo2EqStorage: string;
  avoidedFricheCosts: string;
  taxesIncomeTotal: string;
  propertyTransferDutiesIncome: string;
  localTransferDutiesIncrease: string;
  newHousesTaxesIncome: string;
  newCompanyTaxationIncome: string;
  photovoltaicTaxesIncome: string;
  communalExpensesTotal: string;
  roadsAndUtilitiesMaintenanceExpenses: string;
  waterRegulationExpenses: string;
  avoidedAirPollutionExpenses: string;
  avoidedCo2EqEmissionsValue: string;
};

export function extractAdemeImpactFields(
  computedImpacts: Pick<ComputedImpacts, "impacts" | "contaminatedSurfaceArea">,
): AdemeImpactFields {
  const { impacts, contaminatedSurfaceArea } = computedImpacts;
  const socio = impacts.socioeconomic.impacts;

  return {
    fullTimeJobs: String(impacts.social.fullTimeJobs?.difference ?? ""),
    soilsCo2eqStorageBase: String(impacts.environmental.soilsCo2eqStorage?.base ?? ""),
    soilsCo2eqStorageForecast: String(impacts.environmental.soilsCo2eqStorage?.forecast ?? ""),
    soilsCo2eqStorageVariation: impacts.environmental.soilsCo2eqStorage
      ? percentageDifference(
          impacts.environmental.soilsCo2eqStorage.base,
          impacts.environmental.soilsCo2eqStorage.forecast,
        )
      : "",
    avoidedCo2eqEmissionsCarTraffic: String(
      impacts.environmental.avoidedCo2eqEmissions?.withCarTrafficDiminution ?? "",
    ),
    permeableSurfaceAreaBase: String(impacts.environmental.permeableSurfaceArea.base),
    permeableSurfaceAreaForecast: String(impacts.environmental.permeableSurfaceArea.forecast),
    permeableSurfaceAreaVariation: percentageDifference(
      impacts.environmental.permeableSurfaceArea.base,
      impacts.environmental.permeableSurfaceArea.forecast,
    ),
    contaminatedSurfaceAreaBase: String(contaminatedSurfaceArea?.base ?? ""),
    contaminatedSurfaceAreaForecast: String(contaminatedSurfaceArea?.forecast ?? ""),
    contaminatedSurfaceAreaDifference: String(contaminatedSurfaceArea?.difference ?? ""),
    ecosystemServicesTotal: String(getSocioEconomicAmount(socio, "ecosystem_services")),
    ecosystemServiceNatureRelatedWellnessAndLeisure: String(
      getEcosystemServiceDetail(socio, "nature_related_wellness_and_leisure"),
    ),
    ecosystemServiceForestRelatedProduct: String(
      getEcosystemServiceDetail(socio, "forest_related_product"),
    ),
    ecosystemServicePollination: String(getEcosystemServiceDetail(socio, "pollination")),
    ecosystemServiceInvasiveSpeciesRegulation: String(
      getEcosystemServiceDetail(socio, "invasive_species_regulation"),
    ),
    ecosystemServiceWaterCycle: String(getEcosystemServiceDetail(socio, "water_cycle")),
    ecosystemServiceNitrogenCycle: String(getEcosystemServiceDetail(socio, "nitrogen_cycle")),
    ecosystemServiceSoilErosion: String(getEcosystemServiceDetail(socio, "soil_erosion")),
    ecosystemServiceSoilsCo2EqStorage: String(
      getEcosystemServiceDetail(socio, "soils_co2_eq_storage"),
    ),
    avoidedFricheCosts: String(getSocioEconomicAmount(socio, "avoided_friche_costs")),
    taxesIncomeTotal: String(
      getSocioEconomicAmount(socio, "property_transfer_duties_income") +
        getSocioEconomicAmount(socio, "local_transfer_duties_increase") +
        getSocioEconomicAmount(socio, "taxes_income"),
    ),
    propertyTransferDutiesIncome: String(
      getSocioEconomicAmount(socio, "property_transfer_duties_income"),
    ),
    localTransferDutiesIncrease: String(
      getSocioEconomicAmount(socio, "local_transfer_duties_increase"),
    ),
    newHousesTaxesIncome: String(getTaxesIncomeDetail(socio, "project_new_houses_taxes_income")),
    newCompanyTaxationIncome: String(
      getTaxesIncomeDetail(socio, "project_new_company_taxation_income"),
    ),
    photovoltaicTaxesIncome: String(
      getTaxesIncomeDetail(socio, "project_photovoltaic_taxes_income"),
    ),
    // Dépenses communales — negative in the model (expenses), exported as positive values
    communalExpensesTotal: String(
      Math.abs(getSocioEconomicAmount(socio, "roads_and_utilities_maintenance_expenses")) +
        Math.abs(getSocioEconomicAmount(socio, "water_regulation")),
    ),
    roadsAndUtilitiesMaintenanceExpenses: String(
      Math.abs(getSocioEconomicAmount(socio, "roads_and_utilities_maintenance_expenses")),
    ),
    waterRegulationExpenses: String(Math.abs(getSocioEconomicAmount(socio, "water_regulation"))),
    avoidedAirPollutionExpenses: String(getSocioEconomicAmount(socio, "avoided_air_pollution")),
    avoidedCo2EqEmissionsValue: String(getSocioEconomicAmount(socio, "avoided_co2_eq_emissions")),
  };
}

export const ADEME_IMPACTS_CSV_HEADERS = [
  "Friche",
  "Surface du site (m²)",
  "Projet",
  "Emplois mobilisés (ETP)",
  "CO2-eq stocké dans les sols friche (t)",
  "CO2-eq stocké dans les sols projet (t)",
  "CO2-eq stocké dans les sols variation (%)",
  "CO2-eq évité déplacements (t)",
  "Surface perméable friche (m²)",
  "Surface perméable projet (m²)",
  "Surface perméable variation (%)",
  "Surface polluée avant (m²)",
  "Surface polluée après (m²)",
  "Surface polluée diff (m²)",
  "Services écosystémiques total (€)",
  "SE - Bien-être et loisirs liés à la nature (€)",
  "SE - Produits forestiers (€)",
  "SE - Pollinisation (€)",
  "SE - Régulation espèces invasives (€)",
  "SE - Cycle de l'eau (€)",
  "SE - Cycle de l'azote (€)",
  "SE - Érosion des sols (€)",
  "SE - Stockage CO2 dans les sols (€)",
  "Économies suppression friche (€)",
  "Recettes fiscales total (€)",
  "RF - Droits de mutation transaction foncière (€)",
  "RF - Droits de mutation ventes immobilières alentour (€)",
  "RF - Taxe foncière habitations (€)",
  "RF - Fiscalité entreprises (€)",
  "RF - Fiscalité photovoltaïque (€)",
  "Dépenses communales total (€)",
  "DC - Entretien VRD (€)",
  "DC - Traitement eau (€)",
  "Dépenses santé évitées pollution air (€)",
  "Valeur monétaire décarbonation (€)",
];

export function buildAdemeImpactsCsvRow(
  siteName: string,
  projectName: string,
  computedImpacts: Pick<
    ComputedImpacts,
    "impacts" | "relatedSiteSurfaceArea" | "contaminatedSurfaceArea"
  >,
): string[] {
  const fields = extractAdemeImpactFields(computedImpacts);

  return [
    siteName,
    String(computedImpacts.relatedSiteSurfaceArea),
    projectName,
    fields.fullTimeJobs,
    fields.soilsCo2eqStorageBase,
    fields.soilsCo2eqStorageForecast,
    fields.soilsCo2eqStorageVariation,
    fields.avoidedCo2eqEmissionsCarTraffic,
    fields.permeableSurfaceAreaBase,
    fields.permeableSurfaceAreaForecast,
    fields.permeableSurfaceAreaVariation,
    fields.contaminatedSurfaceAreaBase,
    fields.contaminatedSurfaceAreaForecast,
    fields.contaminatedSurfaceAreaDifference,
    fields.ecosystemServicesTotal,
    fields.ecosystemServiceNatureRelatedWellnessAndLeisure,
    fields.ecosystemServiceForestRelatedProduct,
    fields.ecosystemServicePollination,
    fields.ecosystemServiceInvasiveSpeciesRegulation,
    fields.ecosystemServiceWaterCycle,
    fields.ecosystemServiceNitrogenCycle,
    fields.ecosystemServiceSoilErosion,
    fields.ecosystemServiceSoilsCo2EqStorage,
    fields.avoidedFricheCosts,
    fields.taxesIncomeTotal,
    fields.propertyTransferDutiesIncome,
    fields.localTransferDutiesIncrease,
    fields.newHousesTaxesIncome,
    fields.newCompanyTaxationIncome,
    fields.photovoltaicTaxesIncome,
    fields.communalExpensesTotal,
    fields.roadsAndUtilitiesMaintenanceExpenses,
    fields.waterRegulationExpenses,
    fields.avoidedAirPollutionExpenses,
    fields.avoidedCo2EqEmissionsValue,
  ];
}
