import { fr } from "@codegouvfr/react-dsfr";
import { selectCurrentStep } from "../application/createProject.reducer";
import ProjectCostsIntroduction from "./costs/introduction";
import PhotovoltaicPanelsInstallationCostsForm from "./costs/photovoltaic-panels-installation-costs";
import RealEstateTransactionCostsContainer from "./costs/real-estate-transaction-costs";
import ReinstatementsCostsForm from "./costs/reinstatement-costs";
import YearlyProjectedCostsForm from "./costs/yearly-projected-costs";
import PhotovoltaicContractDurationContainer from "./photovoltaic/contract-duration";
import PhotovoltaicExpectedAnnualProductionContainer from "./photovoltaic/expected-annual-production";
import PhotovoltaicKeyParameter from "./photovoltaic/key-parameter";
import PhotovoltaicPower from "./photovoltaic/power";
import PhotovoltaicSurface from "./photovoltaic/surface";
import ProjectFinancialAssistanceRevenueForm from "./revenue/financial-assistance";
import ProjectRevenueIntroduction from "./revenue/introduction";
import ProjectYearlyProjectedRevenueForm from "./revenue/yearly-projected-revenue";
import ProjectScheduleIntroductionContainer from "./schedule/introduction";
import ProjectScheduleProjectionFormContainer from "./schedule/projection";
import ProjectSoilsCarbonStorageContainer from "./soils/soils-carbon-storage";
import ProjectSoilsDistributionContainer from "./soils/soils-distribution";
import ProjectSoilsSummaryContainer from "./soils/soils-summary";
import ProjectFullTimeJobsInvolvedForm from "./stakeholders/conversion-full-time-jobs-involved";
import FutureOwnerFormContainer from "./stakeholders/future-site-owner";
import HasRealEstateTransactionFormContainer from "./stakeholders/has-real-estate-transaction";
import ProjectStakeholdersIntroduction from "./stakeholders/introduction";
import OperationsFullTimeJobsInvolvedForm from "./stakeholders/operations-full-time-jobs-involved";
import SiteOperatorForm from "./stakeholders/operator";
import SiteReinstatementContractOwnerForm from "./stakeholders/reinstatement-contract-owner";
import ProjectCreationConfirmation from "./confirmation";
import ProjectNameAndDescriptionForm from "./name-and-description";
import ProjectTypesForm from "./project-types";
import RenewableEnergyTypesForm from "./renewable-energy-types";
import Stepper from "./Stepper";
import ProjectionCreationDataSummaryContainer from "./summary";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectCreationWizard() {
  const currentStep = useAppSelector(selectCurrentStep);

  const getStepComponent = () => {
    switch (currentStep) {
      case "PROJECT_TYPES":
        return <ProjectTypesForm />;
      case "RENEWABLE_ENERGY_TYPES":
        return <RenewableEnergyTypesForm />;
      case "STAKEHOLDERS_INTRODUCTION":
        return <ProjectStakeholdersIntroduction />;
      case "STAKEHOLDERS_FUTURE_OPERATOR":
        return <SiteOperatorForm />;
      case "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER":
        return <SiteReinstatementContractOwnerForm />;
      case "STAKEHOLDERS_RECONVERSION_FULL_TIME_JOBS":
        return <ProjectFullTimeJobsInvolvedForm />;
      case "STAKEHOLDERS_OPERATIONS_FULL_TIMES_JOBS":
        return <OperationsFullTimeJobsInvolvedForm />;
      case "STAKEHOLDERS_HAS_REAL_ESTATE_TRANSACTION":
        return <HasRealEstateTransactionFormContainer />;
      case "STAKEHOLDERS_FUTURE_SITE_OWNER":
        return <FutureOwnerFormContainer />;
      case "COSTS_INTRODUCTION":
        return <ProjectCostsIntroduction />;
      case "COSTS_REINSTATEMENT":
        return <ReinstatementsCostsForm />;
      case "COSTS_REAL_ESTATE_TRANSACTION_AMOUNT":
        return <RealEstateTransactionCostsContainer />;
      case "COSTS_PHOTOVOLTAIC_PANELS_INSTALLATION":
        return <PhotovoltaicPanelsInstallationCostsForm />;
      case "COSTS_PROJECTED_YEARLY_COSTS":
        return <YearlyProjectedCostsForm />;
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
      case "SOILS_SURFACE_AREAS":
        return <ProjectSoilsDistributionContainer />;
      case "SOILS_SUMMARY":
        return <ProjectSoilsSummaryContainer />;
      case "SOILS_CARBON_STORAGE":
        return <ProjectSoilsCarbonStorageContainer />;
      case "SCHEDULE_INTRODUCTION":
        return <ProjectScheduleIntroductionContainer />;
      case "SCHEDULE_PROJECTION":
        return <ProjectScheduleProjectionFormContainer />;
      case "FINAL_SUMMARY":
        return <ProjectionCreationDataSummaryContainer />;
      case "CREATION_CONFIRMATION":
        return <ProjectCreationConfirmation />;
    }
  };

  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <Stepper step={currentStep} />
      {getStepComponent()}
    </section>
  );
}

export default ProjectCreationWizard;
