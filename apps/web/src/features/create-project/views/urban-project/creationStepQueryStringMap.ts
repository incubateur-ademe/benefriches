import { UrbanProjectCreationStep } from "../../core/urban-project/creationSteps";

export const URBAN_PROJECT_CREATION_STEP_QUERY_STRING_MAP = {
  URBAN_PROJECT_CREATE_MODE_SELECTION: "mode-creation",
  URBAN_PROJECT_EXPRESS_CATEGORY_SELECTION: "typologie-de-projet-express",
  URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION: "espaces-introduction",
  URBAN_PROJECT_SPACES_CATEGORIES_SELECTION: "espaces-selection",
  URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA: "espaces-surfaces",
  URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION: "introduction-amenagement-des-espaces",
  URBAN_PROJECT_GREEN_SPACES_INTRODUCTION: "espaces-verts-introduction",
  URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION: "espaces-verts-surfaces",
  URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION:
    "espaces-de-vie-et-activites-introduction",
  URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION:
    "espaces-de-vie-et-activites-surfaces",
  URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION: "espaces-publics-introduction",
  URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION: "espaces-publics-surfaces",
  URBAN_PROJECT_SPACES_SOILS_SUMMARY: "recapitulatif-sols-amenagement-des-espaces",
  URBAN_PROJECT_SOILS_CARBON_SUMMARY: "recapitulatif-stockage-carbone-sols",
  URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION: "introduction-depollution-sols",
  URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: "selection-depollution-sols",
  URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: "surface-depollution-sols",
  URBAN_PROJECT_BUILDINGS_INTRODUCTION: "introduction-batiments",
  URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA: "surface-plancher-batiments",
  URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION: "introduction-usages-batiments",
  URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION: "surfaces-usages-batiments",
  URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION: "acteurs-introduction",
  URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: "acteurs-amenageur",
  URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: "acteurs-maitre-ouvrage-remise-en-etat",
  URBAN_PROJECT_SITE_RESALE_INTRODUCTION: "introduction-cession-fonciere",
  URBAN_PROJECT_SITE_RESALE_SELECTION: "cession-fonciere-prevue",
  URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: "cession-batiments-prevue",
  URBAN_PROJECT_EXPENSES_INTRODUCTION: "introduction-depenses",
  URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS: "montant-acquisition-site",
  URBAN_PROJECT_EXPENSES_REINSTATEMENT: "depenses-remise-en-etat",
  URBAN_PROJECT_EXPENSES_INSTALLATION: "depenses-amenagement",
  URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES:
    "depenses-annuelles-exploitation-batiments",
  URBAN_PROJECT_REVENUE_INTRODUCTION: "introduction-recettes",
  URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: "recettes-cession-site",
  URBAN_PROJECT_REVENUE_BUILDINGS_RESALE: "recettes-cession-batiments",
  URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES:
    "recettes-annuelles-exploitation-batiments",
  URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE: "aides-financieres",
  URBAN_PROJECT_SCHEDULE_INTRODUCTION: "introduction-calendrier",
  URBAN_PROJECT_SCHEDULE_PROJECTION: "calendrier",
  URBAN_PROJECT_NAMING: "denomination",
  URBAN_PROJECT_PROJECT_PHASE: "avancement-projet",
  URBAN_PROJECT_FINAL_SUMMARY: "recapitulatif-projet-urbain",
  URBAN_PROJECT_CREATION_RESULT: "fin",
} as const satisfies Record<UrbanProjectCreationStep, string>;
