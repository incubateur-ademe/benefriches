import { lazy, Suspense } from "react";

import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { RenewableEnergyCreationStep } from "../../core/renewable-energy/renewableEnergySteps";
import { HTML_MAIN_TITLE } from "../mainHtmlTitle";

const PhotovoltaicPanelsInstallationExpensesForm = lazy(() => import("./expenses/installation"));
const ProjectExpensesIntroduction = lazy(() => import("./expenses/introduction"));
const ReinstatementsExpensesForm = lazy(() => import("./expenses/reinstatement"));
const SitePurchaseAmountsContainer = lazy(() => import("./expenses/site-purchase-amounts"));
const YearlyProjectedExpensesForm = lazy(() => import("./expenses/yearly-projected-costs"));
const ProjectNameAndDescriptionForm = lazy(() => import("./name-and-description"));
const PhotovoltaicContractDurationContainer = lazy(
  () => import("./photovoltaic/contract-duration"),
);
const PhotovoltaicExpectedAnnualProductionContainer = lazy(
  () => import("./photovoltaic/expected-annual-production"),
);
const PhotovoltaicKeyParameter = lazy(() => import("./photovoltaic/key-parameter"));
const PhotovoltaicPower = lazy(() => import("./photovoltaic/power"));
const PhotovoltaicSurface = lazy(() => import("./photovoltaic/surface"));
const ProjectCreationResult = lazy(() => import("./result"));
const ProjectFinancialAssistanceRevenueForm = lazy(() => import("./revenue/financial-assistance"));
const ProjectRevenueIntroduction = lazy(() => import("./revenue/introduction"));
const ProjectYearlyProjectedRevenueForm = lazy(() => import("./revenue/yearly-projected-revenue"));
const ProjectScheduleProjectionFormContainer = lazy(() => import("./schedule/projection"));
const SoilsDecontaminationIntroduction = lazy(() => import("./soils-decontamination/introduction"));
const SoilsDecontaminationSelection = lazy(() => import("./soils-decontamination/selection"));
const SoilsDecontaminationSurfaceArea = lazy(() => import("./soils-decontamination/surface-area"));
const ProjectSoilsCarbonStorageContainer = lazy(() => import("./soils/soils-carbon-storage"));
const ProjectSoilsSummaryContainer = lazy(() => import("./soils/soils-summary"));
const ClimateAndBiodiversityImpactNotice = lazy(
  () => import("./soils/soils-transformation/climate-and-biodiversity-impact-notice"),
);
const FutureSoilsSelectionForm = lazy(
  () => import("./soils/soils-transformation/future-soils-selection"),
);
const FutureSoilsSurfaceAreaForm = lazy(
  () => import("./soils/soils-transformation/future-soils-surface-area"),
);
const SoilsTransformationIntroduction = lazy(
  () => import("./soils/soils-transformation/introduction"),
);
const NonSuitableSoilsNotice = lazy(
  () => import("./soils/soils-transformation/non-suitable-soils-notice"),
);
const NonSuitableSoilsSelection = lazy(
  () => import("./soils/soils-transformation/non-suitable-soils-selection"),
);
const NonSuitableSoilsSurfaceToTransformForm = lazy(
  () => import("./soils/soils-transformation/non-suitable-soils-surface-to-transform"),
);
const SoilsTransformationProjectSelection = lazy(
  () => import("./soils/soils-transformation/transformation-project-selection"),
);
const DeveloperForm = lazy(() => import("./stakeholders/developer"));
const FutureOwnerFormContainer = lazy(() => import("./stakeholders/future-site-owner"));
const ProjectStakeholdersIntroduction = lazy(() => import("./stakeholders/introduction"));
const SiteOperatorForm = lazy(() => import("./stakeholders/operator"));
const SiteReinstatementContractOwnerForm = lazy(
  () => import("./stakeholders/reinstatement-contract-owner"),
);
const SitePurchasedFormContainer = lazy(() => import("./stakeholders/site-purchased"));
const ProjectionCreationDataSummaryContainer = lazy(() => import("./summary"));

const HTML_PV_PROJECT_FORM_MAIN_TITLE = `Projet photovoltaïque - ${HTML_MAIN_TITLE}`;

type Props = {
  currentStep: RenewableEnergyCreationStep;
};

function PhotovoltaicPowerStationCustomCreationWizard({ currentStep }: Props) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {(() => {
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
          case "RENEWABLE_ENERGY_SCHEDULE_PROJECTION":
            return (
              <>
                <HtmlTitle>{`Saisie - Calendrier- ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
                <ProjectScheduleProjectionFormContainer />
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
      })()}
    </Suspense>
  );
}

export default PhotovoltaicPowerStationCustomCreationWizard;
