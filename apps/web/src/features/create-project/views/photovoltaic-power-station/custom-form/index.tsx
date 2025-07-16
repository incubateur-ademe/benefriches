import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import {
  RenewableEnergyCreationStep,
  RenewableEnergyCustomCreationStep,
} from "../../../core/renewable-energy/creationSteps";
import { HTML_PV_PROJECT_FORM_MAIN_TITLE } from "../PhotovoltaicPowerStationCreationWizard";
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
    case "RENEWABLE_ENERGY_STAKEHOLDERS_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Acteurs - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectStakeholdersIntroduction />
        </>
      );
    case "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER":
      return (
        <>
          <HtmlTitle>{`Aménageur - Acteurs - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <DeveloperForm />
        </>
      );
    case "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR":
      return (
        <>
          <HtmlTitle>{`Futur exploitant - Acteurs - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SiteOperatorForm />
        </>
      );
    case "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER":
      return (
        <>
          <HtmlTitle>{`Maître d'ouvrage de la réhabilitation - Acteurs - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SiteReinstatementContractOwnerForm />
        </>
      );
    case "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE":
      return (
        <>
          <HtmlTitle>{`Changement de propriétaire - Acteurs - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SitePurchasedFormContainer />
        </>
      );
    case "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER":
      return (
        <>
          <HtmlTitle>{`Futur propriétaire - Acteurs - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <FutureOwnerFormContainer />
        </>
      );
    case "RENEWABLE_ENERGY_EXPENSES_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Dépenses - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectExpensesIntroduction />
        </>
      );
    case "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT":
      return (
        <>
          <HtmlTitle>{`Remise en état - Dépenses - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ReinstatementsExpensesForm />
        </>
      );
    case "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS":
      return (
        <>
          <HtmlTitle>{`Achat du site - Dépenses - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SitePurchaseAmountsContainer />
        </>
      );
    case "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION":
      return (
        <>
          <HtmlTitle>{`Installation des panneaux - Dépenses - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <PhotovoltaicPanelsInstallationExpensesForm />
        </>
      );
    case "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES":
      return (
        <>
          <HtmlTitle>{`Exploitation - Dépenses - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <YearlyProjectedExpensesForm />
        </>
      );
    case "RENEWABLE_ENERGY_REVENUE_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Revenus - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectRevenueIntroduction />
        </>
      );
    case "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE":
      return (
        <>
          <HtmlTitle>{`Exploitation - Revenus - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectYearlyProjectedRevenueForm />
        </>
      );
    case "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE":
      return (
        <>
          <HtmlTitle>{`Aides financières - Revenus - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectFinancialAssistanceRevenueForm />
        </>
      );
    case "RENEWABLE_ENERGY_NAMING":
      return (
        <>
          <HtmlTitle>{`Dénomination - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectNameAndDescriptionForm />
        </>
      );
    case "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER":
      return (
        <>
          <HtmlTitle>{`Sélection - Paramètres - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <PhotovoltaicKeyParameter />
        </>
      );
    case "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER":
      return (
        <>
          <HtmlTitle>{`Puissance - Paramètres - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <PhotovoltaicPower />
        </>
      );
    case "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE":
      return (
        <>
          <HtmlTitle>{`Surface des panneaux - Paramètres - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <PhotovoltaicSurface />
        </>
      );
    case "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION":
      return (
        <>
          <HtmlTitle>{`Production attendue - Paramètres - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <PhotovoltaicExpectedAnnualProductionContainer />
        </>
      );
    case "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION":
      return (
        <>
          <HtmlTitle>{`Durée du contrat de revente - Paramètres - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <PhotovoltaicContractDurationContainer />
        </>
      );
    case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Sols - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SoilsTransformationIntroduction />
        </>
      );
    case "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_NOTICE":
      return (
        <>
          <HtmlTitle>{`Introduction - Alerte - Sols - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <NonSuitableSoilsNotice />
        </>
      );
    case "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION":
      return (
        <>
          <HtmlTitle>{`Sélection - Alerte - Sols - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <NonSuitableSoilsSelection />
        </>
      );
    case "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE":
      return (
        <>
          <HtmlTitle>{`Surfaces - Alerte - Sols - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <NonSuitableSoilsSurfaceToTransformForm />
        </>
      );
    case "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Dépollution - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SoilsDecontaminationIntroduction />
        </>
      );
    case "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION":
      return (
        <>
          <HtmlTitle>{`Mode de saisie - Dépollution - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SoilsDecontaminationSelection />
        </>
      );
    case "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA":
      return (
        <>
          <HtmlTitle>{`Surface - Dépollution - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SoilsDecontaminationSurfaceArea />
        </>
      );
    case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION":
      return (
        <>
          <HtmlTitle>{`Sélection - Sols - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SoilsTransformationProjectSelection />
        </>
      );
    case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION":
      return (
        <>
          <HtmlTitle>{`Sélection des catégories - Sols - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <FutureSoilsSelectionForm />
        </>
      );
    case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION":
      return (
        <>
          <HtmlTitle>{`Répartition des surfaces - Sols - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <FutureSoilsSurfaceAreaForm />
        </>
      );
    case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE":
      return (
        <>
          <HtmlTitle>{`Alerte climat et biodiversité - Sols - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ClimateAndBiodiversityImpactNotice />
        </>
      );
    case "RENEWABLE_ENERGY_SOILS_SUMMARY":
      return (
        <>
          <HtmlTitle>{`Récapitulatif - Sols - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectSoilsSummaryContainer />
        </>
      );
    case "RENEWABLE_ENERGY_SOILS_CARBON_STORAGE":
      return (
        <>
          <HtmlTitle>{`Stockage de carbone - Sols - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectSoilsCarbonStorageContainer />
        </>
      );
    case "RENEWABLE_ENERGY_SCHEDULE_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Calendrier - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectScheduleIntroductionContainer />
        </>
      );
    case "RENEWABLE_ENERGY_SCHEDULE_PROJECTION":
      return (
        <>
          <HtmlTitle>{`Saisie - Calendrier- ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectScheduleProjectionFormContainer />
        </>
      );
    case "RENEWABLE_ENERGY_PROJECT_PHASE":
      return (
        <>
          <HtmlTitle>{`Avancement - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectPhaseForm />
        </>
      );
    case "RENEWABLE_ENERGY_FINAL_SUMMARY":
      return (
        <>
          <HtmlTitle>{`Récapitulatif - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectionCreationDataSummaryContainer />
        </>
      );
    case "RENEWABLE_ENERGY_CREATION_RESULT":
      return (
        <>
          <HtmlTitle>{`Résultat - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectCreationResult />
        </>
      );
  }
};

type Props = {
  currentStep: RenewableEnergyCustomCreationStep;
};

function PhotovoltaicPowerStationCustomCreationWizard({ currentStep }: Props) {
  return (
    <SidebarLayout
      mainChildren={getCurrentStepView(currentStep)}
      title="Renseignement du projet"
      sidebarChildren={<PhotovoltaicPowerStationStepper step={currentStep} />}
    />
  );
}

export default PhotovoltaicPowerStationCustomCreationWizard;
