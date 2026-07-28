import type { UrbanProjectUseWithBuilding } from "shared";
import { urbanProjectBuildingsUseSchema } from "shared";

import type { ReconversionProjectFeaturesView } from "src/reconversion-projects/core/model/reconversionProject";
import type { ComputedImpacts } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import type { SiteFeaturesView } from "src/sites/core/models/views";

import { ADEME_IMPACTS_CSV_HEADERS, extractAdemeImpactFields } from "./ademeImpactsCsvRow";

/**
 * Fixed, stable order of building-use columns — the shared schema's declaration order — so the
 * header is identical across runs regardless of what a given project's distribution contains.
 */
const ORDERED_BUILDING_USES = urbanProjectBuildingsUseSchema.options;

/**
 * Duplicated from apps/web/src/shared/core/urbanProject.ts's `getLabelForBuildingsUse`. The API
 * cannot import from the web app, and promoting this to the shared package was declined in favour
 * of the smaller blast radius (see design spec). Typed as an exhaustive record so adding a
 * building use to the shared schema breaks typecheck here instead of silently shipping a missing
 * column label.
 */
const BUILDING_USE_LABELS: Record<UrbanProjectUseWithBuilding, string> = {
  RESIDENTIAL: "Logements",
  LOCAL_STORE: "Commerce de proximité",
  LOCAL_SERVICES: "Service de proximité",
  ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: "Locaux industriels, artisanaux ou logistiques",
  PUBLIC_FACILITIES: "Autres bâtiments publics",
  OFFICES: "Bureaux",
  OTHER_CULTURAL_PLACE: "Autres lieux culturels",
  SPORTS_FACILITIES: "Équipements sportifs",
  MULTI_STORY_PARKING: "Parking silo",
  OTHER_BUILDING: "Autres bâtiments",
  KINDERGARTEN_OR_PRIMARY_SCHOOL: "Crèche, école maternelle ou élémentaire",
  SECONDARY_SCHOOL: "Collège ou lycée",
  OTHER_EDUCATIONAL_FACILITY: "Autre établissement éducatif",
  LOCAL_HEALTH_SERVICE: "Service de santé de proximité",
  HOSPITAL: "Établissement hospitalier",
  MEDICAL_SOCIAL_FACILITY: "Établissement médico-social",
  CINEMA: "Cinéma",
  MUSEUM: "Musée",
  THEATER: "Théâtre",
  RECREATIONAL_FACILITY: "Équipement récréatif",
};

/**
 * `ADEME_IMPACTS_CSV_HEADERS` starts with the site name, site surface area and project name
 * columns (historically "Friche", "Surface du site (m²)", "Projet"). Those now live in the site
 * and project blocks below, so only the pure impact-indicator headers are reused here.
 */
const ADEME_IMPACT_INDICATOR_HEADERS = ADEME_IMPACTS_CSV_HEADERS.slice(3);

export const REFERENTIEL_PROJECTS_CSV_HEADERS: string[] = [
  // context
  "Identifiant du projet",
  "Créé par (identifiant utilisateur)",
  "Date de création",
  // site
  "Commune",
  "Type de site",
  "Nom du site",
  "Surface du site (m²)",
  // project
  "Nom du projet",
  "Type de projet",
  "Durée d'évaluation (années)",
  "Surface de plancher totale (m²)",
  ...ORDERED_BUILDING_USES.map((use) => BUILDING_USE_LABELS[use]),
  // impacts
  ...ADEME_IMPACT_INDICATOR_HEADERS,
  "Temps de trajet gagné (h)",
  "CO2-eq évité climatisation (t)",
  "CO2-eq évité production ENR (t)",
];

/**
 * Site nature other than friche → "Site non friche"; friche whose activity is agriculture →
 * "Friche agricole"; any other friche (including one with no recorded activity) → "Autre friche".
 */
function getSiteTypeLabel(site: SiteFeaturesView): string {
  if (site.nature !== "FRICHE") return "Site non friche";
  return site.fricheActivity === "AGRICULTURE" ? "Friche agricole" : "Autre friche";
}

function getProjectTypeLabel(
  developmentPlanType: ReconversionProjectFeaturesView["developmentPlan"]["type"],
): string {
  return developmentPlanType === "URBAN_PROJECT" ? "Projet urbain" : "Centrale photovoltaïque";
}

/**
 * Context fields not carried by any of the three composed usecases (compute impacts, get site
 * features, get project features) — the script already reads them straight off the
 * `reconversion_projects` row, as it did before this change.
 */
export type ReferentielProjectContext = {
  createdBy: string;
  createdAt: Date;
};

export function buildReferentielProjectsCsvRow(
  projectContext: ReferentielProjectContext,
  computedImpacts: Pick<
    ComputedImpacts,
    "id" | "impacts" | "contaminatedSurfaceArea" | "evaluationPeriodInYears"
  >,
  // undefined when the site lookup failed — the row is still emitted with these cells blank
  site: SiteFeaturesView | undefined,
  // undefined when the project features lookup failed — the row is still emitted with these cells blank
  projectFeatures: ReconversionProjectFeaturesView | undefined,
): string[] {
  const developmentPlan = projectFeatures?.developmentPlan;
  const buildingsFloorAreaDistribution =
    developmentPlan?.type === "URBAN_PROJECT"
      ? developmentPlan.buildingsFloorAreaDistribution
      : undefined;

  const totalFloorArea = buildingsFloorAreaDistribution
    ? String(
        Object.values(buildingsFloorAreaDistribution).reduce<number>(
          (sum, surfaceArea) => sum + (surfaceArea ?? 0),
          0,
        ),
      )
    : "";

  // travel time saved and avoided air-conditioning CO2 are only ever computed for urban projects,
  // avoided renewable-energy CO2 only for photovoltaic plants — mutually exclusive by construction
  // in the impacts model, so these are blank rather than 0 for the project type they don't apply to.
  const travelTimeSaved = String(computedImpacts.impacts.social.travelTimeSaved ?? "");
  const avoidedCo2eqEmissionsAirConditioning = String(
    computedImpacts.impacts.environmental.avoidedCo2eqEmissions?.withAirConditioningDiminution ??
      "",
  );
  const avoidedCo2eqEmissionsRenewableEnergy = String(
    computedImpacts.impacts.environmental.avoidedCo2eqEmissions?.withRenewableEnergyProduction ??
      "",
  );

  const fields = extractAdemeImpactFields(computedImpacts);

  return [
    // context
    computedImpacts.id,
    projectContext.createdBy,
    projectContext.createdAt.toISOString(),
    // site
    site ? site.address.city : "",
    site ? getSiteTypeLabel(site) : "",
    site ? site.name : "",
    site ? String(site.surfaceArea) : "",
    // project
    projectFeatures ? projectFeatures.name : "",
    developmentPlan ? getProjectTypeLabel(developmentPlan.type) : "",
    String(computedImpacts.evaluationPeriodInYears),
    totalFloorArea,
    ...ORDERED_BUILDING_USES.map((use) => {
      const surfaceArea = buildingsFloorAreaDistribution?.[use];
      return surfaceArea === undefined ? "" : String(surfaceArea);
    }),
    // impacts
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
    travelTimeSaved,
    avoidedCo2eqEmissionsAirConditioning,
    avoidedCo2eqEmissionsRenewableEnergy,
  ];
}
