import { useEffect } from "react";
import { selectCurrentStep } from "../application/createProject.reducer";
import { ProjectCreationStep } from "../application/createProject.reducer";

import { routes, useRoute } from "@/app/views/router";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

const PROJECT_CREATION_STEP_QUERY_STRING_MAP = {
  INTRODUCTION: "introduction",
  PROJECT_TYPES: "type-de-projet",
  RENEWABLE_ENERGY_TYPES: "type-systeme-energie-renouvelable",
  PHOTOVOLTAIC_KEY_PARAMETER: "parametre-centrale-photovoltaique",
  PHOTOVOLTAIC_POWER: "puissance-photovoltaique",
  PHOTOVOLTAIC_SURFACE: "surface-photovoltaique",
  PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION: "production-annuelle-prevue-photovoltaique",
  PHOTOVOLTAIC_CONTRACT_DURATION: "duree-contrat-revente-photovoltaique",
  SOILS_DECONTAMINATION_INTRODUCTION: "introduction-depollution-sols",
  SOILS_DECONTAMINATION_SELECTION: "selection-depollution-sols",
  SOILS_DECONTAMINATION_SURFACE_AREA: "surface-depollution-sols",
  SOILS_TRANSFORMATION_INTRODUCTION: "introduction-transformation-sols",
  NON_SUITABLE_SOILS_NOTICE: "info-sols-non-compatibles",
  NON_SUITABLE_SOILS_SELECTION: "selection-sols-non-compatibles-a-transformer",
  NON_SUITABLE_SOILS_SURFACE: "surface-sols-non-compatibles-a-transformer",
  SOILS_TRANSFORMATION_PROJECT_SELECTION: "selection-projet-transformation-sols",
  SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION: "selection-personnalisee-sols-transformation",
  SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION: "allocation-surface-transformation-sols",
  SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE:
    "information-impact-climat-et-biodiversite-transformation-sols",
  SOILS_SUMMARY: "recapitulatif-sols",
  SOILS_CARBON_STORAGE: "stockage-carbone-par-les-sols",
  STAKEHOLDERS_INTRODUCTION: "introduction-acteurs",
  STAKEHOLDERS_PROJECT_DEVELOPER: "amenageur",
  STAKEHOLDERS_FUTURE_OPERATOR: "futur-exploitant",
  STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: "maitre-ouvrage-remise-en-etat",
  STAKEHOLDERS_FUTURE_SITE_OWNER: "futur-proprietaire-du-site",
  STAKEHOLDERS_SITE_PURCHASE: "acquisition-du-site",
  RECONVERSION_FULL_TIME_JOBS: "etp-reconversion",
  OPERATIONS_FULL_TIMES_JOBS: "etp-exploitation",
  EXPENSES_INTRODUCTION: "introduct-depenses",
  EXPENSES_SITE_PURCHASE_AMOUNTS: "montant-acquisition-site",
  EXPENSES_REINSTATEMENT: "depenses-remise-en-etat",
  EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION: "depenses-installation-panneaux-photovoltaiques",
  EXPENSES_PROJECTED_YEARLY_EXPENSES: "depenses-annuelles-previsionnelles",
  REVENUE_INTRODUCTION: "introduction-recettes",
  REVENUE_PROJECTED_YEARLY_REVENUE: "recettes-annuelles-previsionnelles",
  REVENUE_FINANCIAL_ASSISTANCE: "aides-financieres",
  SCHEDULE_INTRODUCTION: "introduction-calendrier",
  SCHEDULE_PROJECTION: "calendrier",
  NAMING: "denomination",
  PROJECT_PHASE: "avancement-projet",
  FINAL_SUMMARY: "recapitulatif-final",
  CREATION_RESULT: "fin",
} as const satisfies Record<ProjectCreationStep, string>;

export const useSyncCreationStepWithRouteQuery = () => {
  const currentStep = useAppSelector(selectCurrentStep);
  const currentRoute = useRoute();

  useEffect(() => {
    if (currentRoute.name !== routes.createProject.name) return;
    if (!(currentStep in PROJECT_CREATION_STEP_QUERY_STRING_MAP)) return;

    routes
      .createProject({
        siteId: currentRoute.params.siteId,
        etape: PROJECT_CREATION_STEP_QUERY_STRING_MAP[currentStep],
      })
      .push();
    // we don't care about other parameters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, currentRoute.name]);
};
