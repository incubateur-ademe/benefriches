import type { ReconversionProjectImpacts, SocioEconomicImpact } from "shared";

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

export const ADEME_IMPACTS_CSV_HEADERS = [
  "Friche",
  "Projet",
  "Emplois mobilisés (ETP)",
  "CO2-eq stocké dans les sols friche (t)",
  "CO2-eq stocké dans les sols projet (t)",
  "CO2-eq stocké dans les sols variation (%)",
  "CO2-eq évité déplacements (t)",
  "Surface perméable friche (m²)",
  "Surface perméable projet (m²)",
  "Surface perméable variation (%)",
  "Surface non contaminée avant (m²)",
  "Surface non contaminée après (m²)",
  "Surface non contaminée diff (m²)",
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
  impacts: ReconversionProjectImpacts,
): string[] {
  const socio = impacts.socioeconomic.impacts;

  return [
    siteName,
    projectName,
    String(impacts.social.fullTimeJobs?.difference ?? ""),
    String(impacts.environmental.soilsCo2eqStorage?.base ?? ""),
    String(impacts.environmental.soilsCo2eqStorage?.forecast ?? ""),
    impacts.environmental.soilsCo2eqStorage
      ? percentageDifference(
          impacts.environmental.soilsCo2eqStorage.base,
          impacts.environmental.soilsCo2eqStorage.forecast,
        )
      : "",
    String(impacts.environmental.avoidedCo2eqEmissions?.withCarTrafficDiminution ?? ""),
    String(impacts.environmental.permeableSurfaceArea.base),
    String(impacts.environmental.permeableSurfaceArea.forecast),
    percentageDifference(
      impacts.environmental.permeableSurfaceArea.base,
      impacts.environmental.permeableSurfaceArea.forecast,
    ),
    String(impacts.environmental.nonContaminatedSurfaceArea?.base ?? ""),
    String(impacts.environmental.nonContaminatedSurfaceArea?.forecast ?? ""),
    String(impacts.environmental.nonContaminatedSurfaceArea?.difference ?? ""),
    String(getSocioEconomicAmount(socio, "ecosystem_services")),
    String(getEcosystemServiceDetail(socio, "nature_related_wellness_and_leisure")),
    String(getEcosystemServiceDetail(socio, "forest_related_product")),
    String(getEcosystemServiceDetail(socio, "pollination")),
    String(getEcosystemServiceDetail(socio, "invasive_species_regulation")),
    String(getEcosystemServiceDetail(socio, "water_cycle")),
    String(getEcosystemServiceDetail(socio, "nitrogen_cycle")),
    String(getEcosystemServiceDetail(socio, "soil_erosion")),
    String(getEcosystemServiceDetail(socio, "soils_co2_eq_storage")),
    String(getSocioEconomicAmount(socio, "avoided_friche_costs")),
    String(
      getSocioEconomicAmount(socio, "property_transfer_duties_income") +
        getSocioEconomicAmount(socio, "local_transfer_duties_increase") +
        getSocioEconomicAmount(socio, "taxes_income"),
    ),
    String(getSocioEconomicAmount(socio, "property_transfer_duties_income")),
    String(getSocioEconomicAmount(socio, "local_transfer_duties_increase")),
    String(getTaxesIncomeDetail(socio, "project_new_houses_taxes_income")),
    String(getTaxesIncomeDetail(socio, "project_new_company_taxation_income")),
    String(getTaxesIncomeDetail(socio, "project_photovoltaic_taxes_income")),
    // Dépenses communales — negative in the model (expenses), exported as positive values
    String(
      Math.abs(getSocioEconomicAmount(socio, "roads_and_utilities_maintenance_expenses")) +
        Math.abs(getSocioEconomicAmount(socio, "water_regulation")),
    ),
    String(Math.abs(getSocioEconomicAmount(socio, "roads_and_utilities_maintenance_expenses"))),
    String(Math.abs(getSocioEconomicAmount(socio, "water_regulation"))),
    String(getSocioEconomicAmount(socio, "avoided_air_pollution")),
    String(getSocioEconomicAmount(socio, "avoided_co2_eq_emissions")),
  ];
}
