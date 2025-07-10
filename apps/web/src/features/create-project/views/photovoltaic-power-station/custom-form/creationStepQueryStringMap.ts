import { RenewableEnergyCreationStep } from "../../../core/renewable-energy/creationSteps";

export const RENEWABLE_ENERGY_PROJECT_CREATION_STEP_QUERY_STRING_MAP = {
  RENEWABLE_ENERGY_TYPES: "type-systeme-energie-renouvelable",
  RENEWABLE_ENERGY_CREATE_MODE_SELECTION: "mode-creation",
  RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: "parametre-centrale-photovoltaique",
  RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: "puissance-photovoltaique",
  RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE: "surface-photovoltaique",
  RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION:
    "production-annuelle-prevue-photovoltaique",
  RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION: "duree-contrat-revente-photovoltaique",
  RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION: "introduction-depollution-sols",
  RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION: "selection-depollution-sols",
  RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA: "surface-depollution-sols",
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION: "introduction-transformation-sols",
  RENEWABLE_ENERGY_NON_SUITABLE_SOILS_NOTICE: "info-sols-non-compatibles",
  RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION: "selection-sols-non-compatibles-a-transformer",
  RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE: "surface-sols-non-compatibles-a-transformer",
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION: "selection-projet-transformation-sols",
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION:
    "selection-personnalisee-sols-transformation",
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION:
    "allocation-surface-transformation-sols",
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE:
    "information-impact-climat-et-biodiversite-transformation-sols",
  RENEWABLE_ENERGY_SOILS_SUMMARY: "recapitulatif-sols",
  RENEWABLE_ENERGY_SOILS_CARBON_STORAGE: "stockage-carbone-par-les-sols",
  RENEWABLE_ENERGY_STAKEHOLDERS_INTRODUCTION: "introduction-acteurs",
  RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER: "amenageur",
  RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR: "futur-exploitant",
  RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: "maitre-ouvrage-remise-en-etat",
  RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER: "futur-proprietaire-du-site",
  RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE: "acquisition-du-site",
  RENEWABLE_ENERGY_EXPENSES_INTRODUCTION: "introduct-depenses",
  RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS: "montant-acquisition-site",
  RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT: "depenses-remise-en-etat",
  RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION:
    "depenses-installation-panneaux-photovoltaiques",
  RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES: "depenses-annuelles-previsionnelles",
  RENEWABLE_ENERGY_REVENUE_INTRODUCTION: "introduction-recettes",
  RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE: "recettes-annuelles-previsionnelles",
  RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE: "aides-financieres",
  RENEWABLE_ENERGY_SCHEDULE_INTRODUCTION: "introduction-calendrier",
  RENEWABLE_ENERGY_SCHEDULE_PROJECTION: "calendrier",
  RENEWABLE_ENERGY_NAMING: "denomination",
  RENEWABLE_ENERGY_PROJECT_PHASE: "avancement-projet",
  RENEWABLE_ENERGY_FINAL_SUMMARY: "recapitulatif-final",
  RENEWABLE_ENERGY_CREATION_RESULT: "fin",
} as const satisfies Record<RenewableEnergyCreationStep, string>;
