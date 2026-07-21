import { lazy, ReactNode } from "react";

import { RenewableEnergyCreationStep } from "@/features/create-project/core/renewable-energy/renewableEnergySteps";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";

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
const InvolvesReinstatementContainer = lazy(
  () => import("./soils-decontamination/involves-reinstatement"),
);
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
const ProjectDataSummaryContainer = lazy(() => import("./summary"));

export const getPhotovoltaicPowerStationStepView = (
  currentStep: RenewableEnergyCreationStep,
  { mainTitle }: { mainTitle: string },
): ReactNode => {
  switch (currentStep) {
    case "RENEWABLE_ENERGY_STAKEHOLDERS_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Acteurs - ${mainTitle}`}</HtmlTitle>
          <ProjectStakeholdersIntroduction />
        </>
      );
    case "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER":
      return (
        <>
          <HtmlTitle>{`Aménageur - Acteurs - ${mainTitle}`}</HtmlTitle>
          <DeveloperForm />
        </>
      );
    case "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR":
      return (
        <>
          <HtmlTitle>{`Futur exploitant - Acteurs - ${mainTitle}`}</HtmlTitle>
          <SiteOperatorForm />
        </>
      );
    case "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER":
      return (
        <>
          <HtmlTitle>{`Maître d'ouvrage de la réhabilitation - Acteurs - ${mainTitle}`}</HtmlTitle>
          <SiteReinstatementContractOwnerForm />
        </>
      );
    case "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE":
      return (
        <>
          <HtmlTitle>{`Changement de propriétaire - Acteurs - ${mainTitle}`}</HtmlTitle>
          <SitePurchasedFormContainer />
        </>
      );
    case "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER":
      return (
        <>
          <HtmlTitle>{`Futur propriétaire - Acteurs - ${mainTitle}`}</HtmlTitle>
          <FutureOwnerFormContainer />
        </>
      );
    case "RENEWABLE_ENERGY_EXPENSES_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Dépenses - ${mainTitle}`}</HtmlTitle>
          <ProjectExpensesIntroduction />
        </>
      );
    case "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT":
      return (
        <>
          <HtmlTitle>{`Remise en état - Dépenses - ${mainTitle}`}</HtmlTitle>
          <ReinstatementsExpensesForm />
        </>
      );
    case "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS":
      return (
        <>
          <HtmlTitle>{`Achat du site - Dépenses - ${mainTitle}`}</HtmlTitle>
          <SitePurchaseAmountsContainer />
        </>
      );
    case "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION":
      return (
        <>
          <HtmlTitle>{`Installation des panneaux - Dépenses - ${mainTitle}`}</HtmlTitle>
          <PhotovoltaicPanelsInstallationExpensesForm />
        </>
      );
    case "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES":
      return (
        <>
          <HtmlTitle>{`Exploitation - Dépenses - ${mainTitle}`}</HtmlTitle>
          <YearlyProjectedExpensesForm />
        </>
      );
    case "RENEWABLE_ENERGY_REVENUE_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Revenus - ${mainTitle}`}</HtmlTitle>
          <ProjectRevenueIntroduction />
        </>
      );
    case "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE":
      return (
        <>
          <HtmlTitle>{`Exploitation - Revenus - ${mainTitle}`}</HtmlTitle>
          <ProjectYearlyProjectedRevenueForm />
        </>
      );
    case "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE":
      return (
        <>
          <HtmlTitle>{`Aides financières - Revenus - ${mainTitle}`}</HtmlTitle>
          <ProjectFinancialAssistanceRevenueForm />
        </>
      );
    case "RENEWABLE_ENERGY_NAMING":
      return (
        <>
          <HtmlTitle>{`Dénomination - ${mainTitle}`}</HtmlTitle>
          <ProjectNameAndDescriptionForm />
        </>
      );
    case "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER":
      return (
        <>
          <HtmlTitle>{`Sélection - Paramètres - ${mainTitle}`}</HtmlTitle>
          <PhotovoltaicKeyParameter />
        </>
      );
    case "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER":
      return (
        <>
          <HtmlTitle>{`Puissance - Paramètres - ${mainTitle}`}</HtmlTitle>
          <PhotovoltaicPower />
        </>
      );
    case "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE":
      return (
        <>
          <HtmlTitle>{`Surface des panneaux - Paramètres - ${mainTitle}`}</HtmlTitle>
          <PhotovoltaicSurface />
        </>
      );
    case "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION":
      return (
        <>
          <HtmlTitle>{`Production attendue - Paramètres - ${mainTitle}`}</HtmlTitle>
          <PhotovoltaicExpectedAnnualProductionContainer />
        </>
      );
    case "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION":
      return (
        <>
          <HtmlTitle>{`Durée du contrat de revente - Paramètres - ${mainTitle}`}</HtmlTitle>
          <PhotovoltaicContractDurationContainer />
        </>
      );
    case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Sols - ${mainTitle}`}</HtmlTitle>
          <SoilsTransformationIntroduction />
        </>
      );
    case "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_NOTICE":
      return (
        <>
          <HtmlTitle>{`Introduction - Alerte - Sols - ${mainTitle}`}</HtmlTitle>
          <NonSuitableSoilsNotice />
        </>
      );
    case "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION":
      return (
        <>
          <HtmlTitle>{`Sélection - Alerte - Sols - ${mainTitle}`}</HtmlTitle>
          <NonSuitableSoilsSelection />
        </>
      );
    case "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE":
      return (
        <>
          <HtmlTitle>{`Surfaces - Alerte - Sols - ${mainTitle}`}</HtmlTitle>
          <NonSuitableSoilsSurfaceToTransformForm />
        </>
      );
    case "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT":
      return (
        <>
          <HtmlTitle>{`Remise en état - ${mainTitle}`}</HtmlTitle>
          <InvolvesReinstatementContainer />
        </>
      );
    case "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Dépollution - ${mainTitle}`}</HtmlTitle>
          <SoilsDecontaminationIntroduction />
        </>
      );
    case "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION":
      return (
        <>
          <HtmlTitle>{`Mode de saisie - Dépollution - ${mainTitle}`}</HtmlTitle>
          <SoilsDecontaminationSelection />
        </>
      );
    case "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA":
      return (
        <>
          <HtmlTitle>{`Surface - Dépollution - ${mainTitle}`}</HtmlTitle>
          <SoilsDecontaminationSurfaceArea />
        </>
      );
    case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION":
      return (
        <>
          <HtmlTitle>{`Sélection - Sols - ${mainTitle}`}</HtmlTitle>
          <SoilsTransformationProjectSelection />
        </>
      );
    case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION":
      return (
        <>
          <HtmlTitle>{`Sélection des catégories - Sols - ${mainTitle}`}</HtmlTitle>
          <FutureSoilsSelectionForm />
        </>
      );
    case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION":
      return (
        <>
          <HtmlTitle>{`Répartition des surfaces - Sols - ${mainTitle}`}</HtmlTitle>
          <FutureSoilsSurfaceAreaForm />
        </>
      );
    case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE":
      return (
        <>
          <HtmlTitle>{`Alerte climat et biodiversité - Sols - ${mainTitle}`}</HtmlTitle>
          <ClimateAndBiodiversityImpactNotice />
        </>
      );
    case "RENEWABLE_ENERGY_SOILS_SUMMARY":
      return (
        <>
          <HtmlTitle>{`Récapitulatif - Sols - ${mainTitle}`}</HtmlTitle>
          <ProjectSoilsSummaryContainer />
        </>
      );
    case "RENEWABLE_ENERGY_SOILS_CARBON_STORAGE":
      return (
        <>
          <HtmlTitle>{`Stockage de carbone - Sols - ${mainTitle}`}</HtmlTitle>
          <ProjectSoilsCarbonStorageContainer />
        </>
      );
    case "RENEWABLE_ENERGY_SCHEDULE_PROJECTION":
      return (
        <>
          <HtmlTitle>{`Saisie - Calendrier- ${mainTitle}`}</HtmlTitle>
          <ProjectScheduleProjectionFormContainer />
        </>
      );
    case "RENEWABLE_ENERGY_FINAL_SUMMARY":
      return (
        <>
          <HtmlTitle>{`Récapitulatif - ${mainTitle}`}</HtmlTitle>
          <ProjectDataSummaryContainer />
        </>
      );
    case "RENEWABLE_ENERGY_CREATION_RESULT":
      return (
        <>
          <HtmlTitle>{`Résultat - ${mainTitle}`}</HtmlTitle>
          <ProjectCreationResult />
        </>
      );
  }
};
