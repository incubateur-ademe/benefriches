import { useAppSelector } from "@/app/hooks/store.hooks";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";

import { selectCurrentStep } from "../../core/createSite.reducer";
import { getParcelTypeFromStepId } from "../../core/urban-zone/steps/per-parcel-soils/parcelStepMapping";
import { HTML_MAIN_TITLE } from "../SiteCreationWizard";
import UrbanZoneCreationResultContainer from "./creation-result";
import ExpensesAndIncomeIntroductionContainer from "./expenses-and-income-introduction";
import ExpensesAndIncomeSummaryContainer from "./expenses-and-income-summary";
import UrbanZoneFinalSummaryContainer from "./final-summary";
import FullTimeJobsEquivalentContainer from "./full-time-jobs-equivalent";
import LandParcelBuildingsFloorAreaContainer from "./land-parcel-buildings-floor-area";
import LandParcelSoilsDistributionContainer from "./land-parcel-soils-distribution";
import LandParcelsSelectionContainer from "./land-parcels-selection";
import LandParcelsSurfaceDistributionContainer from "./land-parcels-surface-distribution";
import LocalAuthorityExpensesContainer from "./local-authority-expenses";
import ManagementIntroductionContainer from "./management-introduction";
import ManagerContainer from "./manager";
import NamingContainer from "./naming";
import NamingIntroductionContainer from "./naming-introduction";
import SoilsAndSpacesIntroductionContainer from "./soils-and-spaces-introduction";
import UrbanZoneSoilsCarbonStorageContainer from "./soils-carbon-storage";
import SoilsContaminationContainer from "./soils-contamination";
import SoilsContaminationIntroductionContainer from "./soils-contamination-introduction";
import UrbanZoneSoilsSummaryContainer from "./soils-summary";
import VacantCommercialPremisesFloorAreaContainer from "./vacant-commercial-premises-floor-area";
import VacantCommercialPremisesFootprintContainer from "./vacant-commercial-premises-footprint";
import VacantPremisesExpensesContainer from "./vacant-premises-expenses";
import ZoneManagementExpensesContainer from "./zone-management-expenses";
import ZoneManagementIncomeContainer from "./zone-management-income";

function SiteCreationUrbanZoneStepContent() {
  const currentStep = useAppSelector(selectCurrentStep);

  switch (currentStep) {
    case "URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Sols et espaces - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SoilsAndSpacesIntroductionContainer />
        </>
      );
    case "URBAN_ZONE_LAND_PARCELS_SELECTION":
      return (
        <>
          <HtmlTitle>{`Surfaces foncières - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <LandParcelsSelectionContainer />
        </>
      );
    case "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION":
      return (
        <>
          <HtmlTitle>{`Surfaces des parcelles - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <LandParcelsSurfaceDistributionContainer />
        </>
      );
    case "URBAN_ZONE_SOILS_SUMMARY":
      return (
        <>
          <HtmlTitle>{`Récapitulatif des sols - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <UrbanZoneSoilsSummaryContainer />
        </>
      );
    case "URBAN_ZONE_SOILS_CARBON_STORAGE":
      return (
        <>
          <HtmlTitle>{`Stockage du carbone par les sols - Sols et espaces - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <UrbanZoneSoilsCarbonStorageContainer />
        </>
      );
    case "URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Pollution - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SoilsContaminationIntroductionContainer />
        </>
      );
    case "URBAN_ZONE_SOILS_CONTAMINATION":
      return (
        <>
          <HtmlTitle>{`Pollution des sols - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SoilsContaminationContainer />
        </>
      );
    case "URBAN_ZONE_MANAGEMENT_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Gestion et activité - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <ManagementIntroductionContainer />
        </>
      );
    case "URBAN_ZONE_MANAGER":
      return (
        <>
          <HtmlTitle>{`Gestionnaire - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <ManagerContainer />
        </>
      );
    case "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT":
      return (
        <>
          <HtmlTitle>{`Emprise foncière des locaux vacants - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <VacantCommercialPremisesFootprintContainer />
        </>
      );
    case "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA":
      return (
        <>
          <HtmlTitle>{`Surface de plancher des locaux vacants - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <VacantCommercialPremisesFloorAreaContainer />
        </>
      );
    case "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT":
      return (
        <>
          <HtmlTitle>{`Emplois en équivalent temps plein - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <FullTimeJobsEquivalentContainer />
        </>
      );
    case "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Dépenses et recettes - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <ExpensesAndIncomeIntroductionContainer />
        </>
      );
    case "URBAN_ZONE_VACANT_PREMISES_EXPENSES":
      return (
        <>
          <HtmlTitle>{`Dépenses locaux vacants - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <VacantPremisesExpensesContainer />
        </>
      );
    case "URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES":
      return (
        <>
          <HtmlTitle>{`Dépenses de gestion - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <ZoneManagementExpensesContainer />
        </>
      );
    case "URBAN_ZONE_ZONE_MANAGEMENT_INCOME":
      return (
        <>
          <HtmlTitle>{`Recettes - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <ZoneManagementIncomeContainer />
        </>
      );
    case "URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY":
      return (
        <>
          <HtmlTitle>{`Récapitulatif dépenses et recettes - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <ExpensesAndIncomeSummaryContainer />
        </>
      );
    case "URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES":
      return (
        <>
          <HtmlTitle>{`Dépenses collectivité - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <LocalAuthorityExpensesContainer />
        </>
      );
    case "URBAN_ZONE_NAMING_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Dénomination - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <NamingIntroductionContainer />
        </>
      );
    case "URBAN_ZONE_NAMING":
      return (
        <>
          <HtmlTitle>{`Dénomination du site - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <NamingContainer />
        </>
      );
    case "URBAN_ZONE_FINAL_SUMMARY":
      return (
        <>
          <HtmlTitle>{`Récapitulatif - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <UrbanZoneFinalSummaryContainer />
        </>
      );
    case "URBAN_ZONE_CREATION_RESULT":
      return (
        <>
          <HtmlTitle>{`Création du site - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <UrbanZoneCreationResultContainer />
        </>
      );
    // key={parcelType} forces React to remount the form when switching between parcel types.
    // Without it, react-hook-form's useForm keeps its internal state from the previous parcel
    // because defaultValues is only read on mount.
    default: {
      const parcelType = getParcelTypeFromStepId(currentStep);
      if (parcelType) {
        if (currentStep.endsWith("_SOILS_DISTRIBUTION")) {
          return (
            <>
              <HtmlTitle>{`Superficie des sols - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
              <LandParcelSoilsDistributionContainer key={parcelType} parcelType={parcelType} />
            </>
          );
        }
        if (currentStep.endsWith("_BUILDINGS_FLOOR_AREA")) {
          return (
            <>
              <HtmlTitle>{`Surface de plancher - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
              <LandParcelBuildingsFloorAreaContainer key={parcelType} parcelType={parcelType} />
            </>
          );
        }
      }
      return <HtmlTitle>{`Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>;
    }
  }
}

export default SiteCreationUrbanZoneStepContent;
