import { useState } from "react";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import {
  PhotovoltaicProjectCreationStep,
  selectCurrentStep,
} from "../../application/createProject.reducer";
import SoilsDecontaminationIntroduction from "../common-views/soils-decontamination/introduction";
import SoilsDecontaminationSelection from "../common-views/soils-decontamination/selection";
import SoilsDecontaminationSurfaceArea from "../common-views/soils-decontamination/surface-area";
import RenewableEnergyTypesForm from "../renewable-energy-types";
import PhotovoltaicPowerStationStepper from "./PhotovoltaicPowerStationStepper";
import ProjectExpensesIntroduction from "./costs/introduction";
import PhotovoltaicPanelsInstallationExpensesForm from "./costs/photovoltaic-panels-installation-costs";
import ReinstatementsExpensesForm from "./costs/reinstatement-costs";
import SitePurchaseAmountsContainer from "./costs/site-purchase-amounts";
import YearlyProjectedExpensesForm from "./costs/yearly-projected-costs";
import ProjectFullTimeJobsInvolvedForm from "./jobs/conversion-full-time-jobs-involved";
import OperationsFullTimeJobsInvolvedForm from "./jobs/operations-full-time-jobs-involved";
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
    case "RECONVERSION_FULL_TIME_JOBS":
      return <ProjectFullTimeJobsInvolvedForm />;
    case "OPERATIONS_FULL_TIMES_JOBS":
      return <OperationsFullTimeJobsInvolvedForm />;
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
  const currentStep = useAppSelector(selectCurrentStep) as PhotovoltaicProjectCreationStep;
  const [isOpen, setOpen] = useState(true);

  return (
    <SidebarLayout
      mainChildren={getCurrentStepView(currentStep)}
      title="Renseignement du projet"
      isOpen={isOpen}
      toggleIsOpen={() => {
        setOpen((current) => !current);
      }}
      sidebarChildren={<PhotovoltaicPowerStationStepper step={currentStep} isExtended={isOpen} />}
    />
  );
}

export default PhotovoltaicPowerStationCreationWizard;
