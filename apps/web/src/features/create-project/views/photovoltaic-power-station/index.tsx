import { PhotovoltaicProjectCreationStep } from "@/features/create-project/core/renewable-energy/renewableEnergy.reducer";
import { selectCurrentStep } from "@/features/create-project/core/renewable-energy/selectors/renewableEnergy.selector";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import RenewableEnergyTypesForm from "../renewable-energy-types";
import { useSyncCreationStepWithRouteQuery } from "../useSyncCreationStepWithRouteQuery";
import PhotovoltaicPowerStationStepper from "./PhotovoltaicPowerStationStepper";
import PhotovoltaicPanelsInstallationExpensesForm from "./expenses/installation";
import ProjectExpensesIntroduction from "./expenses/introduction";
import ReinstatementsExpensesForm from "./expenses/reinstatement";
import SitePurchaseAmountsContainer from "./expenses/site-purchase-amounts";
import YearlyProjectedExpensesForm from "./expenses/yearly-projected-costs";
import ProjectNameAndDescriptionForm from "./name-and-description";
import PhotovoltaicContractDurationContainer from "./photovoltaic/contract-duration";
import PhotovoltaicExpectedAnnualProductionContainer from "./photovoltaic/expected-annual-production";
import PhotovoltaicKeyParameter from "./photovoltaic/key-parameter";
import PhotovoltaicPower from "./photovoltaic/power";
import PhotovoltaicSurface from "./photovoltaic/surface";
import ProjectPhaseForm from "./project-phase";
import ProjectCreationResult from "./result";
import ProjectFinancialAssistanceRevenueForm from "./revenue/financial-assistance";
import ProjectRevenueIntroduction from "./revenue/introduction";
import ProjectYearlyProjectedRevenueForm from "./revenue/yearly-projected-revenue";
import ProjectScheduleIntroductionContainer from "./schedule/introduction";
import ProjectScheduleProjectionFormContainer from "./schedule/projection";
import SoilsDecontaminationIntroduction from "./soils-decontamination/introduction";
import SoilsDecontaminationSelection from "./soils-decontamination/selection";
import SoilsDecontaminationSurfaceArea from "./soils-decontamination/surface-area";
import ProjectSoilsCarbonStorageContainer from "./soils/soils-carbon-storage";
import ProjectSoilsSummaryContainer from "./soils/soils-summary";
import ClimateAndBiodiversityImpactNotice from "./soils/soils-transformation/climate-and-biodiversity-impact-notice";
import FutureSoilsSelectionForm from "./soils/soils-transformation/future-soils-selection";
import FutureSoilsSurfaceAreaForm from "./soils/soils-transformation/future-soils-surface-area";
import SoilsTransformationIntroduction from "./soils/soils-transformation/introduction";
import NonSuitableSoilsNotice from "./soils/soils-transformation/non-suitable-soils-notice";
import NonSuitableSoilsSelection from "./soils/soils-transformation/non-suitable-soils-selection";
import NonSuitableSoilsSurfaceToTransformForm from "./soils/soils-transformation/non-suitable-soils-surface-to-transform";
import SoilsTransformationProjectSelection from "./soils/soils-transformation/transformation-project-selection";
import DeveloperForm from "./stakeholders/developer";
import FutureOwnerFormContainer from "./stakeholders/future-site-owner";
import ProjectStakeholdersIntroduction from "./stakeholders/introduction";
import SiteOperatorForm from "./stakeholders/operator";
import SiteReinstatementContractOwnerForm from "./stakeholders/reinstatement-contract-owner";
import SitePurchasedFormContainer from "./stakeholders/site-purchased";
import ProjectionCreationDataSummaryContainer from "./summary";

const PROJECT_CREATION_STEP_QUERY_STRING_MAP = {
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
} as const satisfies Record<PhotovoltaicProjectCreationStep, string>;

const getCurrentStepView = (currentStep: PhotovoltaicProjectCreationStep) => {
  switch (currentStep) {
    case "RENEWABLE_ENERGY_TYPES":
      return <RenewableEnergyTypesForm />;
    case "STAKEHOLDERS_INTRODUCTION":
      return <ProjectStakeholdersIntroduction />;
    case "STAKEHOLDERS_PROJECT_DEVELOPER":
      return <DeveloperForm />;
    case "STAKEHOLDERS_FUTURE_OPERATOR":
      return <SiteOperatorForm />;
    case "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER":
      return <SiteReinstatementContractOwnerForm />;
    case "STAKEHOLDERS_SITE_PURCHASE":
      return <SitePurchasedFormContainer />;
    case "STAKEHOLDERS_FUTURE_SITE_OWNER":
      return <FutureOwnerFormContainer />;
    case "EXPENSES_INTRODUCTION":
      return <ProjectExpensesIntroduction />;
    case "EXPENSES_REINSTATEMENT":
      return <ReinstatementsExpensesForm />;
    case "EXPENSES_SITE_PURCHASE_AMOUNTS":
      return <SitePurchaseAmountsContainer />;
    case "EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION":
      return <PhotovoltaicPanelsInstallationExpensesForm />;
    case "EXPENSES_PROJECTED_YEARLY_EXPENSES":
      return <YearlyProjectedExpensesForm />;
    case "REVENUE_INTRODUCTION":
      return <ProjectRevenueIntroduction />;
    case "REVENUE_PROJECTED_YEARLY_REVENUE":
      return <ProjectYearlyProjectedRevenueForm />;
    case "REVENUE_FINANCIAL_ASSISTANCE":
      return <ProjectFinancialAssistanceRevenueForm />;
    case "NAMING":
      return <ProjectNameAndDescriptionForm />;
    case "PHOTOVOLTAIC_KEY_PARAMETER":
      return <PhotovoltaicKeyParameter />;
    case "PHOTOVOLTAIC_POWER":
      return <PhotovoltaicPower />;
    case "PHOTOVOLTAIC_SURFACE":
      return <PhotovoltaicSurface />;
    case "PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION":
      return <PhotovoltaicExpectedAnnualProductionContainer />;
    case "PHOTOVOLTAIC_CONTRACT_DURATION":
      return <PhotovoltaicContractDurationContainer />;
    case "SOILS_TRANSFORMATION_INTRODUCTION":
      return <SoilsTransformationIntroduction />;
    case "NON_SUITABLE_SOILS_NOTICE":
      return <NonSuitableSoilsNotice />;
    case "NON_SUITABLE_SOILS_SELECTION":
      return <NonSuitableSoilsSelection />;
    case "NON_SUITABLE_SOILS_SURFACE":
      return <NonSuitableSoilsSurfaceToTransformForm />;
    case "SOILS_DECONTAMINATION_INTRODUCTION":
      return <SoilsDecontaminationIntroduction />;
    case "SOILS_DECONTAMINATION_SELECTION":
      return <SoilsDecontaminationSelection />;
    case "SOILS_DECONTAMINATION_SURFACE_AREA":
      return <SoilsDecontaminationSurfaceArea />;
    case "SOILS_TRANSFORMATION_PROJECT_SELECTION":
      return <SoilsTransformationProjectSelection />;
    case "SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION":
      return <FutureSoilsSelectionForm />;
    case "SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION":
      return <FutureSoilsSurfaceAreaForm />;
    case "SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE":
      return <ClimateAndBiodiversityImpactNotice />;
    case "SOILS_SUMMARY":
      return <ProjectSoilsSummaryContainer />;
    case "SOILS_CARBON_STORAGE":
      return <ProjectSoilsCarbonStorageContainer />;
    case "SCHEDULE_INTRODUCTION":
      return <ProjectScheduleIntroductionContainer />;
    case "SCHEDULE_PROJECTION":
      return <ProjectScheduleProjectionFormContainer />;
    case "PROJECT_PHASE":
      return <ProjectPhaseForm />;
    case "FINAL_SUMMARY":
      return <ProjectionCreationDataSummaryContainer />;
    case "CREATION_RESULT":
      return <ProjectCreationResult />;
  }
};

function PhotovoltaicPowerStationCreationWizard() {
  const currentStep = useAppSelector(selectCurrentStep);

  useSyncCreationStepWithRouteQuery(PROJECT_CREATION_STEP_QUERY_STRING_MAP[currentStep]);

  return (
    <SidebarLayout
      mainChildren={getCurrentStepView(currentStep)}
      title="Renseignement du projet"
      sidebarChildren={<PhotovoltaicPowerStationStepper step={currentStep} />}
    />
  );
}

export default PhotovoltaicPowerStationCreationWizard;
