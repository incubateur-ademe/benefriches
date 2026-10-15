import type {
  GetReconversionProjectImpactsResultDto,
  ProjectOnSiteImpactMetric,
  SiteStatuQuoImpactMetric,
  SoilType,
  UrbanProjectUseWithBuilding,
} from "shared";
import { ORDERED_SOIL_TYPES, roundTo2Digits, urbanProjectBuildingsUseSchema } from "shared";

const ECOSYSTEM_SERVICES = [
  "newStoredCo2Eq",
  "natureRelatedWelnessAndLeisure",
  "forestRelatedProduct",
  "pollination",
  "invasiveSpeciesRegulation",
  "waterCycle",
  "nitrogenCycle",
  "soilErosion",
] as const;

const ORDERED_BUILDING_USES = urbanProjectBuildingsUseSchema.options;

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
const getLabelForSoilType = (value: SoilType): string => {
  switch (value) {
    case "BUILDINGS":
      return "Bâtiments";
    case "IMPERMEABLE_SOILS":
      return "Sols imperméabilisés";
    case "MINERAL_SOIL":
      return "Sols perméables minéraux";
    case "ARTIFICIAL_GRASS_OR_BUSHES_FILLED":
      return "Sols enherbés et arbustifs";
    case "ARTIFICIAL_TREE_FILLED":
      return "Sol arboré";
    case "FOREST_CONIFER":
      return "Forêt de conifères";
    case "FOREST_DECIDUOUS":
      return "Forêt de feuillus";
    case "FOREST_POPLAR":
      return "Forêt de peupliers";
    case "FOREST_MIXED":
      return "Forêt mixte";
    case "PRAIRIE_GRASS":
      return "Prairie herbacée";
    case "PRAIRIE_BUSHES":
      return "Prairie arbustive";
    case "PRAIRIE_TREES":
      return "Prairie arborée";
    case "WET_LAND":
      return "Zone humide";
    case "CULTIVATION":
      return "Culture";
    case "ORCHARD":
      return "Verger";
    case "VINEYARD":
      return "Vigne";
    case "WATER":
      return "Plan d'eau";
  }
};
export const DEVELOPMENT_SCORE_PROJECTS_CSV_HEADERS: string[] = [
  // context
  "Identifiant du site",
  "Identifiant du projet",
  "Créé par (identifiant utilisateur)",
  "Date de création du site",
  "Dernière modification du site",
  "Date de création du projet",
  "Dernière modification du projet",
  // site
  "Commune (code insee)",
  "Type de site",
  "Nom du site",
  "Surface du site (m²)",
  ...ORDERED_SOIL_TYPES.map((soilType) => `statu quo -> ${getLabelForSoilType(soilType)} (en %)`),
  "Surface du site polluée (en %)",
  // project
  "Nom du projet",
  "Type de projet",
  ...ORDERED_SOIL_TYPES.map((soilType) => `projet -> ${getLabelForSoilType(soilType)} (en %)`),
  "Surface de plancher totale (en m²)",
  ...ORDERED_BUILDING_USES.map((use) => BUILDING_USE_LABELS[use]),
  "Surface de bâti réutilisée (en m²)",
  "Surface décontaminée (en m²)",
  "Nécessité de remise en état",
  // development score
  "Score lettre global qualifié",
  "Score lettre global",
  "Score numérique global",

  "Score lettre finances de la collectivité",
  "Score numérique finances de la collectivité",
  "Dépenses d'équipement pour l'année de la commune",
  "Année de référence des dépenses d'équipement de la commune",
  "Total impacts économiques pour la collectivité",
  "Pourcentage comparatif impacts collectivité et dépenses d'équipements de la commune",

  "Score lettre emploi",
  "Score numérique emploi",
  "ETP statu quo",
  "différence ETP après reconversion",
  "nombre d'ETP / ha après reconversion",

  "Score lettre qualifié qualité de vie des riverains",
  "Score lettre qualité de vie des riverains",
  "Score numérique qualité de vie des riverains",

  "Score lettre qualité de vie des riverains > cadre de vie",
  "Score lettre qualité de vie des riverains > accès aux soins",
  "Score lettre qualité de vie des riverains > accès aux services",
  "Score lettre qualité de vie des riverains > santé",
  "Score lettre qualité de vie des riverains > accidents sur la friche",
  "Score lettre qualité de vie des riverains > sécurité routière",

  "Score lettre qualifié environnement",
  "Score lettre environnement",
  "Score numérique environnement",

  "Score lettre environnement > objectif ZAN",
  "Score lettre environnement > émissions CO²eq",
  "Score lettre environnement > services écosystémiques",
  "Score lettre environnement > qualité des sols",
  "Score lettre environnement > qualité de l'eau",

  ...ECOSYSTEM_SERVICES.map((impact) => {
    switch (impact) {
      case "forestRelatedProduct":
        return "SE - Produits forestiers (€)";
      case "invasiveSpeciesRegulation":
        return "SE - Régulation espèces invasives (€)";
      case "newStoredCo2Eq":
        return "SE - Stockage CO2 dans les sols (€)";
      case "natureRelatedWelnessAndLeisure":
        return "SE - Bien-être et loisirs liés à la nature (€)";
      case "pollination":
        return "SE - Pollinisation (€)";
      case "waterCycle":
        return "SE - Cycle de l'eau (€)";
      case "nitrogenCycle":
        return "SE - Cycle de l'azote (€)";
      case "soilErosion":
        return "SE - Érosion des sols (€)";
    }
  }),

  "CO2-eq stocké dans les sols statu quo (t)",
  "CO2-eq stocké dans les sols projet (difference, en t)",
  "CO2-eq évité projet (t)",
  "CO2-eq stocké dans les sols variation (%)",

  "Différence Surface perméable après projet (m²)",
  "Variation Surface perméable après projet (%)",
  "Surface polluée statu quo (m²)",
  "Surface polluée différence après projet (m²)",
  "Variation surface polluée après projet (%)",
];

function getSiteTypeLabel(cx: GetReconversionProjectImpactsResultDto["contextData"]): string {
  if (cx.siteNature !== "FRICHE") return "Site non friche";
  return cx.fricheActivity === "AGRICULTURE" ? "Friche agricole" : "Autre friche";
}

function getProjectTypeLabel(
  developmentPlanType: GetReconversionProjectImpactsResultDto["contextData"]["projectDevelopmentPlan"]["type"],
): string {
  return developmentPlanType === "URBAN_PROJECT" ? "Projet urbain" : "Centrale photovoltaïque";
}

const fmt = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null) return "";
  if (typeof value === "number") return String(value).replace(".", ",");
  return value;
};

export function buildDevelopmentScoreProjectsCsvRow(props: {
  createdBy: string;
  createdAt: Date;
  updatedAt: Date | undefined;
  siteCreatedAt: Date;
  siteUpdatedAt: Date | undefined;
  cityCode: string;
  contextData: GetReconversionProjectImpactsResultDto["contextData"];
  impacts: GetReconversionProjectImpactsResultDto["impacts"];
  developmentScore: GetReconversionProjectImpactsResultDto["developmentScore"];
}): string[] {
  const developmentPlan = props.contextData.projectDevelopmentPlan;

  const buildingsFloorAreaDistribution =
    developmentPlan?.type === "URBAN_PROJECT"
      ? developmentPlan.buildingsFloorAreaDistribution
      : undefined;

  const buildingsFootprintToReuse =
    developmentPlan?.type === "URBAN_PROJECT"
      ? developmentPlan.buildingsFootprintToReuse
      : undefined;

  const totalFloorArea = buildingsFloorAreaDistribution
    ? String(
        Object.values(buildingsFloorAreaDistribution).reduce<number>(
          (sum, surfaceArea) => sum + (surfaceArea ?? 0),
          0,
        ),
      )
    : "";

  const buildingsRehabilitation = props.impacts.projectEconomicBalance.details.find(
    (item) =>
      item.name === "projectBuildingsInstallation" &&
      item.details === "buildings_rehabilitation_works",
  )?.total;
  const hasBuildingsRehabilitation = buildingsRehabilitation && buildingsRehabilitation > 0;

  const { details } = props.developmentScore;
  const localAuthority = details.localAuthorityEconomicScore;
  const qualityOfLife = details.localPeopleQualityOfLifeScore;
  const environment = details.environmentScore;

  const getSoilTypePercentage = (
    metrics: (ProjectOnSiteImpactMetric | SiteStatuQuoImpactMetric)[],
    soilType: SoilType,
  ) => {
    const total = metrics.find(
      (item) => item.name === "soilsDistribution" && item.soilType === soilType,
    )?.total;
    if (!total) return "";
    return fmt(roundTo2Digits((total / props.contextData.siteSurfaceArea) * 100));
  };

  const contaminatedSiteSurface =
    props.impacts.reconversionImpactsBreakdown.siteStatuQuoImpactMetrics.find(
      (item) => item.name === "contaminatedSurface",
    )?.total;

  return [
    // context
    props.contextData.relatedSiteId,
    props.contextData.projectId,
    props.createdBy,
    props.siteCreatedAt.toISOString(),
    props.siteUpdatedAt ? props.siteUpdatedAt.toISOString() : "",
    props.createdAt.toISOString(),
    props.updatedAt ? props.updatedAt.toISOString() : "",
    // site
    props.cityCode,
    getSiteTypeLabel(props.contextData),
    props.contextData.relatedSiteName,
    fmt(props.contextData.siteSurfaceArea),
    ...ORDERED_SOIL_TYPES.map((soilType) =>
      getSoilTypePercentage(
        props.impacts.reconversionImpactsBreakdown.siteStatuQuoImpactMetrics,
        soilType,
      ),
    ),
    fmt(
      contaminatedSiteSurface
        ? roundTo2Digits((contaminatedSiteSurface / props.contextData.siteSurfaceArea) * 100)
        : "",
    ),
    // project
    props.contextData.projectName,
    getProjectTypeLabel(props.contextData.projectDevelopmentPlan.type),
    ...ORDERED_SOIL_TYPES.map((soilType) =>
      getSoilTypePercentage(
        props.impacts.reconversionImpactsBreakdown.projectIndirectImpactMetrics,
        soilType,
      ),
    ),
    totalFloorArea,
    ...ORDERED_BUILDING_USES.map((use) => fmt(buildingsFloorAreaDistribution?.[use])),
    fmt(buildingsFootprintToReuse ?? ""),
    fmt(
      props.impacts.reconversionImpactsBreakdown.projectIndirectImpactMetrics.find(
        (item) => item.name === "decontaminatedSurface",
      )?.total,
    ),
    hasBuildingsRehabilitation ? "Oui" : "Non",
    // development score
    // development score global
    fmt(props.developmentScore.score.letterGradeWithModifiers),
    fmt(props.developmentScore.score.letterGrade),
    fmt(props.developmentScore.score.gradePoints),

    // finances de la collectivité
    fmt(localAuthority.score.letterGrade),
    fmt(localAuthority.score.gradePoints),
    fmt(
      localAuthority.indicators.localAuthorityFinances.metrics
        .municipalityCapitalExpendituresAmount ?? "",
    ),
    fmt(
      localAuthority.indicators.localAuthorityFinances.metrics
        .municipalityCapitalExpendituresReferenceYear ?? "",
    ),
    fmt(
      localAuthority.indicators.localAuthorityFinances.metrics
        .projectLocalAuthorityIndirectEconomicImpactsTotal ?? "",
    ),
    fmt(localAuthority.indicators.localAuthorityFinances.metrics.percentageComparison ?? ""),

    fmt(props.developmentScore.details.fullTimeJobsScore.score.letterGrade),
    fmt(props.developmentScore.details.fullTimeJobsScore.score.gradePoints),
    fmt(
      props.developmentScore.details.fullTimeJobsScore.indicators.fullTimeJobs.metrics
        .siteStatuQuoFullTimeJobs ?? "",
    ),
    fmt(
      props.developmentScore.details.fullTimeJobsScore.indicators.fullTimeJobs.metrics.difference ??
        "",
    ),
    fmt(
      props.developmentScore.details.fullTimeJobsScore.indicators.fullTimeJobs.metrics
        .fullTimeJobsDifferenceByHectare ?? "",
    ),
    // qualité de vie
    fmt(qualityOfLife.score.letterGradeWithModifiers),
    fmt(qualityOfLife.score.letterGrade),
    fmt(qualityOfLife.score.gradePoints),
    fmt(qualityOfLife.indicators.livingEnvironment.letterGrade ?? ""),
    fmt(qualityOfLife.indicators.accessToHealthCare.letterGrade ?? ""),
    fmt(qualityOfLife.indicators.accessToLocalServices.letterGrade ?? ""),
    fmt(qualityOfLife.indicators.localHealthiness.letterGrade ?? ""),
    fmt(qualityOfLife.indicators.fricheAccidents.letterGrade ?? ""),
    fmt(qualityOfLife.indicators.trafficSecurity.letterGrade ?? ""),

    // environnement
    fmt(environment.score.letterGradeWithModifiers),
    fmt(environment.score.letterGrade),
    fmt(environment.score.gradePoints),
    fmt(props.developmentScore.details.environmentScore.indicators.zanCompliance.letterGrade ?? ""),
    fmt(
      props.developmentScore.details.environmentScore.indicators.co2eqEmissionsVariation
        .letterGrade ?? "",
    ),
    fmt(
      props.developmentScore.details.environmentScore.indicators.ecosystemServices.letterGrade ??
        "",
    ),
    fmt(props.developmentScore.details.environmentScore.indicators.soilsQuality.letterGrade ?? ""),
    fmt(props.developmentScore.details.environmentScore.indicators.waterQuality.letterGrade ?? ""),

    ...ECOSYSTEM_SERVICES.map((impact) =>
      fmt(
        props.developmentScore.details.environmentScore.indicators.ecosystemServices.metrics.ecosystemicServices.find(
          (i) => i.name === impact,
        )?.total ?? "",
      ),
    ),

    fmt(
      props.developmentScore.details.environmentScore.indicators.co2eqEmissionsVariation.metrics
        .siteStatuQuoStoredCo2Eq ?? "",
    ),
    fmt(
      props.developmentScore.details.environmentScore.indicators.co2eqEmissionsVariation.metrics
        .newStoredCo2Eq ?? "",
    ),
    fmt(
      props.developmentScore.details.environmentScore.indicators.co2eqEmissionsVariation.metrics
        .avoidedCo2eqEmissions ?? "",
    ),
    fmt(
      props.developmentScore.details.environmentScore.indicators.co2eqEmissionsVariation.metrics
        .soilStoredPercentageVariation ?? "",
    ),
    fmt(
      props.developmentScore.details.environmentScore.indicators.soilsQuality.metrics
        .permeableSurfaceDifference.difference ?? "",
    ),
    fmt(
      props.developmentScore.details.environmentScore.indicators.soilsQuality.metrics
        .permeableSurfaceDifference.percentVariation ?? "",
    ),
    fmt(
      props.developmentScore.details.environmentScore.indicators.soilsQuality.metrics.contamination
        .siteContaminatedSurface ?? "",
    ),
    fmt(
      props.developmentScore.details.environmentScore.indicators.soilsQuality.metrics.contamination
        .difference ?? "",
    ),
    fmt(
      props.developmentScore.details.environmentScore.indicators.soilsQuality.metrics.contamination
        .percentVariation ?? "",
    ),
  ];
}
