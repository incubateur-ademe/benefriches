// oxlint-disable no-console
import { configDotenv } from "dotenv";
import knex from "knex";
import fs from "node:fs";
import path from "node:path";
import type { ReconversionProjectImpacts } from "shared";
import type { SocioEconomicImpact } from "shared";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { buildAdemeScriptComputeImpactsUseCase } from "./ademeScriptDeps";

const dotEnvPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(dotEnvPath)) {
  configDotenv({ path: dotEnvPath });
}

const userId = process.argv[2];
const outputPath = process.argv[3] ?? path.resolve(__dirname, "ademe-impacts-export.csv");

if (!userId) {
  console.error(
    "Usage: pnpm exec tsx src/reconversion-projects/adapters/secondary/ademe-csv-import/export-ademe-impacts-csv.ts <user-id> [output-csv-path]",
  );
  process.exit(1);
}

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

function escapeCsvValue(value: string | number): string {
  const str = String(value);
  if (str.includes(";") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildCsvRow(
  siteName: string,
  projectName: string,
  impacts: ReconversionProjectImpacts,
): string[] {
  const socio = impacts.socioeconomic.impacts;

  return [
    siteName,
    projectName,
    // Emplois mobilisés
    String(impacts.social.fullTimeJobs?.difference ?? ""),
    // CO2-eq stocké dans les sols (en tonne) — friche, projet, variation %
    String(impacts.environmental.soilsCo2eqStorage?.base ?? ""),
    String(impacts.environmental.soilsCo2eqStorage?.forecast ?? ""),
    impacts.environmental.soilsCo2eqStorage
      ? percentageDifference(
          impacts.environmental.soilsCo2eqStorage.base,
          impacts.environmental.soilsCo2eqStorage.forecast,
        )
      : "",
    // CO2-eq évité du fait des déplacements évités (en tonne)
    String(impacts.environmental.avoidedCo2eqEmissions?.withCarTrafficDiminution ?? ""),
    // Surface perméable (en m²) — friche, projet, variation %
    String(impacts.environmental.permeableSurfaceArea.base),
    String(impacts.environmental.permeableSurfaceArea.forecast),
    percentageDifference(
      impacts.environmental.permeableSurfaceArea.base,
      impacts.environmental.permeableSurfaceArea.forecast,
    ),
    // Surface polluée (en m²) — on reporte la surface non contaminée (base = surface polluée avant, forecast = après)
    String(impacts.environmental.nonContaminatedSurfaceArea?.base ?? ""),
    String(impacts.environmental.nonContaminatedSurfaceArea?.forecast ?? ""),
    String(impacts.environmental.nonContaminatedSurfaceArea?.difference ?? ""),
    // Services écosystémiques — total
    String(getSocioEconomicAmount(socio, "ecosystem_services")),
    // Services écosystémiques — détail par service
    String(getEcosystemServiceDetail(socio, "nature_related_wellness_and_leisure")),
    String(getEcosystemServiceDetail(socio, "forest_related_product")),
    String(getEcosystemServiceDetail(socio, "pollination")),
    String(getEcosystemServiceDetail(socio, "invasive_species_regulation")),
    String(getEcosystemServiceDetail(socio, "water_cycle")),
    String(getEcosystemServiceDetail(socio, "nitrogen_cycle")),
    String(getEcosystemServiceDetail(socio, "soil_erosion")),
    String(getEcosystemServiceDetail(socio, "soils_co2_eq_storage")),
    // Économies réalisées grâce à la suppression de la friche (total avoided_friche_costs)
    String(getSocioEconomicAmount(socio, "avoided_friche_costs")),
    // Recettes fiscales (property_transfer_duties_income + local_transfer_duties_increase + taxes_income)
    String(
      getSocioEconomicAmount(socio, "property_transfer_duties_income") +
        getSocioEconomicAmount(socio, "local_transfer_duties_increase") +
        getSocioEconomicAmount(socio, "taxes_income"),
    ),
    // Détail recettes fiscales
    String(getSocioEconomicAmount(socio, "property_transfer_duties_income")),
    String(getSocioEconomicAmount(socio, "local_transfer_duties_increase")),
    String(getTaxesIncomeDetail(socio, "project_new_houses_taxes_income")),
    String(getTaxesIncomeDetail(socio, "project_new_company_taxation_income")),
    String(getTaxesIncomeDetail(socio, "project_photovoltaic_taxes_income")),
    // Dépenses communales (roads_and_utilities_maintenance_expenses + water_regulation)
    // These are negative in the model (expenses), but we want positive values in the export
    String(
      Math.abs(getSocioEconomicAmount(socio, "roads_and_utilities_maintenance_expenses")) +
        Math.abs(getSocioEconomicAmount(socio, "water_regulation")),
    ),
    String(Math.abs(getSocioEconomicAmount(socio, "roads_and_utilities_maintenance_expenses"))),
    String(Math.abs(getSocioEconomicAmount(socio, "water_regulation"))),
    // Dépenses de santé évitées grâce à la réduction de la pollution de l'air
    String(getSocioEconomicAmount(socio, "avoided_air_pollution")),
    // Valeur monétaire de la décarbonation
    String(getSocioEconomicAmount(socio, "avoided_co2_eq_emissions")),
  ];
}

const CSV_HEADERS = [
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

// oxlint-disable-next-line typescript/no-floating-promises
(async () => {
  console.info("Connecting to database...");
  const db = knex(knexConfig);

  try {
    // Fetch all reconversion project IDs for this user
    const projects = await db("reconversion_projects")
      .select("reconversion_projects.id", "reconversion_projects.name")
      .join("sites", "sites.id", "reconversion_projects.related_site_id")
      .where("sites.created_by", userId)
      .orderBy("reconversion_projects.created_at");

    console.info(`Found ${projects.length} projects for user ${userId}`);

    const computeImpactsUseCase = buildAdemeScriptComputeImpactsUseCase(db);

    const csvLines: string[] = [CSV_HEADERS.map(escapeCsvValue).join(";")];

    let successCount = 0;
    let errorCount = 0;

    for (const project of projects) {
      try {
        const result = await computeImpactsUseCase.execute({
          reconversionProjectId: project.id as string,
          evaluationPeriodInYears: 50,
        });

        if (!result.isSuccess()) {
          console.error(`❌ ${project.name}: ${result.getError()}`);
          errorCount++;
          continue;
        }

        const resultData = result.getData();
        const { impacts } = resultData;
        const row = buildCsvRow(resultData.relatedSiteName, project.name as string, impacts);
        csvLines.push(row.map(escapeCsvValue).join(";"));
        successCount++;
        console.info(`✅ ${project.name}`);
      } catch (error) {
        console.error(
          `❌ ${project.name}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        errorCount++;
      }
    }

    const resolvedOutputPath = path.resolve(outputPath);
    fs.writeFileSync(resolvedOutputPath, csvLines.join("\n"), "utf-8");
    console.info(`\n📊 CSV exported to: ${resolvedOutputPath}`);
    console.info(`   ${successCount} projects exported, ${errorCount} errors`);
  } catch (error) {
    process.exitCode = 1;
    console.error("Fatal error:", error);
  } finally {
    await db.destroy();
  }
})();
