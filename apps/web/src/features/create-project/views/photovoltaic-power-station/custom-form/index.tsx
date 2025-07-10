import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import { RenewableEnergyCreationStep } from "../../../core/renewable-energy/creationSteps";
import RenewableEnergyTypesForm from "../../renewable-energy-types";
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

const getCurrentStepView = (currentStep: RenewableEnergyCreationStep) => {
  switch (currentStep) {
    case "RENEWABLE_ENERGY_TYPES":
      return <RenewableEnergyTypesForm />;
    case "RENEWABLE_ENERGY_STAKEHOLDERS_INTRODUCTION":
      return <ProjectStakeholdersIntroduction />;
    case "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER":
      return <DeveloperForm />;
    case "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR":
      return <SiteOperatorForm />;
    case "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER":
      return <SiteReinstatementContractOwnerForm />;
    case "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE":
      return <SitePurchasedFormContainer />;
    case "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER":
      return <FutureOwnerFormContainer />;
    case "RENEWABLE_ENERGY_EXPENSES_INTRODUCTION":
      return <ProjectExpensesIntroduction />;
    case "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT":
      return <ReinstatementsExpensesForm />;
    case "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS":
      return <SitePurchaseAmountsContainer />;
    case "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION":
      return <PhotovoltaicPanelsInstallationExpensesForm />;
    case "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES":
      return <YearlyProjectedExpensesForm />;
    case "RENEWABLE_ENERGY_REVENUE_INTRODUCTION":
      return <ProjectRevenueIntroduction />;
    case "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE":
      return <ProjectYearlyProjectedRevenueForm />;
    case "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE":
      return <ProjectFinancialAssistanceRevenueForm />;
    case "RENEWABLE_ENERGY_NAMING":
      return <ProjectNameAndDescriptionForm />;
    case "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER":
      return <PhotovoltaicKeyParameter />;
    case "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER":
      return <PhotovoltaicPower />;
    case "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE":
      return <PhotovoltaicSurface />;
    case "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION":
      return <PhotovoltaicExpectedAnnualProductionContainer />;
    case "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION":
      return <PhotovoltaicContractDurationContainer />;
    case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION":
      return <SoilsTransformationIntroduction />;
    case "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_NOTICE":
      return <NonSuitableSoilsNotice />;
    case "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION":
      return <NonSuitableSoilsSelection />;
    case "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE":
      return <NonSuitableSoilsSurfaceToTransformForm />;
    case "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION":
      return <SoilsDecontaminationIntroduction />;
    case "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION":
      return <SoilsDecontaminationSelection />;
    case "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA":
      return <SoilsDecontaminationSurfaceArea />;
    case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION":
      return <SoilsTransformationProjectSelection />;
    case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION":
      return <FutureSoilsSelectionForm />;
    case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION":
      return <FutureSoilsSurfaceAreaForm />;
    case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE":
      return <ClimateAndBiodiversityImpactNotice />;
    case "RENEWABLE_ENERGY_SOILS_SUMMARY":
      return <ProjectSoilsSummaryContainer />;
    case "RENEWABLE_ENERGY_SOILS_CARBON_STORAGE":
      return <ProjectSoilsCarbonStorageContainer />;
    case "RENEWABLE_ENERGY_SCHEDULE_INTRODUCTION":
      return <ProjectScheduleIntroductionContainer />;
    case "RENEWABLE_ENERGY_SCHEDULE_PROJECTION":
      return <ProjectScheduleProjectionFormContainer />;
    case "RENEWABLE_ENERGY_PROJECT_PHASE":
      return <ProjectPhaseForm />;
    case "RENEWABLE_ENERGY_FINAL_SUMMARY":
      return <ProjectionCreationDataSummaryContainer />;
    case "RENEWABLE_ENERGY_CREATION_RESULT":
      return <ProjectCreationResult />;
  }
};

type Props = {
  currentStep: RenewableEnergyCreationStep;
};

function PhotovoltaicPowerStationCreationWizard({ currentStep }: Props) {
  return (
    <SidebarLayout
      mainChildren={getCurrentStepView(currentStep)}
      title="Renseignement du projet"
      sidebarChildren={<PhotovoltaicPowerStationStepper step={currentStep} />}
    />
  );
}

export default PhotovoltaicPowerStationCreationWizard;
