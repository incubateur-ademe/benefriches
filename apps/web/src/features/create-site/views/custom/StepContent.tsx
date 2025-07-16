import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import { selectCurrentStep } from "../../core/createSite.reducer";
import { HTML_MAIN_TITLE } from "../SiteCreationWizard";
import AgriculturalOperationActivityForm from "../common-views/agricultural-operation-activity";
import NaturalAreaTypeForm from "../common-views/natural-area-type";
import FricheAccidentsForm from "./accidents/accidents-count";
import FricheAccidentsIntroduction from "./accidents/introduction";
import AddressForm from "./address";
import FricheActivityForm from "./friche-activity";
import SiteNameAndDescriptionForm from "./naming";
import SiteNamingIntroduction from "./naming/introduction";
import SiteCreationResult from "./result";
import SiteExpensesIncomeSummary from "./site-management/expenses-and-income/expenses-income-summary";
import SiteExpensesAndIncomeIntroduction from "./site-management/expenses-and-income/introduction";
import SiteYearlyExpensesForm from "./site-management/expenses-and-income/yearly-expenses";
import SiteYearlyIncomeForm from "./site-management/expenses-and-income/yearly-income";
import SiteManagementIntroduction from "./site-management/introduction";
import IsFricheLeasedForm from "./site-management/stakeholders/is-friche-leased";
import IsSiteOperatedForm from "./site-management/stakeholders/is-site-operated";
import SiteOwnerForm from "./site-management/stakeholders/owner";
import SiteOperatorForm from "./site-management/stakeholders/site-operator";
import SiteTenantForm from "./site-management/stakeholders/tenant";
import SoilContaminationForm from "./soil-contamination";
import SoilContaminationIntroduction from "./soil-contamination/introduction";
import SiteSoilsCarbonStorage from "./spaces-and-soils/soils-carbon-storage";
import SiteSoilsSummary from "./spaces-and-soils/soils-summary";
import SiteSpacesDistribution from "./spaces-and-soils/spaces-distribution/distribution";
import SiteSpacesDistributionKnowledge from "./spaces-and-soils/spaces-distribution/spaces-distribution-knowledge";
import SiteSpacesIntroduction from "./spaces-and-soils/spaces-introduction";
import SpacesKnowledgeForm from "./spaces-and-soils/spaces-knowledge";
import SiteSpacesSelectionForm from "./spaces-and-soils/spaces-selection";
import SiteSurfaceAreaForm from "./spaces-and-soils/surface-area";
import SiteDataSummary from "./summary";

function SiteCreationCustomStepContent() {
  const currentStep = useAppSelector(selectCurrentStep);

  switch (currentStep) {
    case "FRICHE_ACTIVITY":
      return (
        <>
          <HtmlTitle>{`Ancienne activité - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <FricheActivityForm />
        </>
      );
    case "AGRICULTURAL_OPERATION_ACTIVITY":
      return (
        <>
          <HtmlTitle>{`Type d'exploitation - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <AgriculturalOperationActivityForm />
        </>
      );
    case "NATURAL_AREA_TYPE":
      return (
        <>
          <HtmlTitle>{`Type d'espace naturel - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <NaturalAreaTypeForm />
        </>
      );
    case "ADDRESS":
      return (
        <>
          <HtmlTitle>{`Adresse - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <AddressForm />
        </>
      );
    case "SPACES_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Espaces - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteSpacesIntroduction />
        </>
      );
    case "SURFACE_AREA":
      return (
        <>
          <HtmlTitle>{`Surface - Espaces - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteSurfaceAreaForm />
        </>
      );
    case "SPACES_KNOWLEDGE":
      return (
        <>
          <HtmlTitle>{`Type de saisie - Espaces - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SpacesKnowledgeForm />
        </>
      );
    case "SPACES_SELECTION":
      return (
        <>
          <HtmlTitle>{`Sélection - Espaces - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteSpacesSelectionForm />
        </>
      );
    case "SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE":
      return (
        <>
          <HtmlTitle>{`Type de saisie pour la distribution des surfaces - Espaces - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteSpacesDistributionKnowledge />
        </>
      );
    case "SPACES_SURFACE_AREA_DISTRIBUTION":
      return (
        <>
          <HtmlTitle>{`Distribution des surfaces - Espaces - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteSpacesDistribution />
        </>
      );
    case "SOILS_SUMMARY":
      return (
        <>
          <HtmlTitle>{`Récapitulatif des surfaces - Espaces - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteSoilsSummary />
        </>
      );
    case "SOILS_CARBON_STORAGE":
      return (
        <>
          <HtmlTitle>{`Stockage du carbone - Espaces - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteSoilsCarbonStorage />
        </>
      );
    case "SOILS_CONTAMINATION_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Pollution - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SoilContaminationIntroduction />
        </>
      );
    case "SOILS_CONTAMINATION":
      return (
        <>
          <HtmlTitle>{`Surface - Pollution - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SoilContaminationForm />
        </>
      );
    case "FRICHE_ACCIDENTS_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Accidents - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <FricheAccidentsIntroduction />
        </>
      );
    case "FRICHE_ACCIDENTS":
      return (
        <>
          <HtmlTitle>{`Nombre - Accidents - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <FricheAccidentsForm />
        </>
      );
    case "MANAGEMENT_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Gestion - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteManagementIntroduction />
        </>
      );
    case "OWNER":
      return (
        <>
          <HtmlTitle>{`Propriétaire - Gestion - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteOwnerForm />
        </>
      );
    case "IS_FRICHE_LEASED":
      return (
        <>
          <HtmlTitle>{`Location - Gestion - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <IsFricheLeasedForm />
        </>
      );
    case "IS_SITE_OPERATED":
      return (
        <>
          <HtmlTitle>{`Exploitation - Gestion - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <IsSiteOperatedForm />
        </>
      );
    case "OPERATOR":
      return (
        <>
          <HtmlTitle>{`Exploitant - Gestion - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteOperatorForm />
        </>
      );
    case "TENANT":
      return (
        <>
          <HtmlTitle>{`Locataire - Gestion - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteTenantForm />
        </>
      );
    case "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Dépenses et revenus - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteExpensesAndIncomeIntroduction />
        </>
      );
    case "YEARLY_EXPENSES":
      return (
        <>
          <HtmlTitle>{`Dépenses annuelles - Dépenses et revenus - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteYearlyExpensesForm />
        </>
      );
    case "YEARLY_INCOME":
      return (
        <>
          <HtmlTitle>{`Revenus annuels - Dépenses et revenus - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteYearlyIncomeForm />
        </>
      );
    case "YEARLY_EXPENSES_SUMMARY":
      return (
        <>
          <HtmlTitle>{`Récapitulatif - Dépenses et revenus - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteExpensesIncomeSummary />
        </>
      );
    case "NAMING_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Dénomination - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteNamingIntroduction />
        </>
      );
    case "NAMING":
      return (
        <>
          <HtmlTitle>{`Nom et description - Dénomination - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteNameAndDescriptionForm />
        </>
      );
    case "FINAL_SUMMARY":
      return (
        <>
          <HtmlTitle>{`Récapitulatif - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteDataSummary />
        </>
      );
    case "CREATION_RESULT":
      return (
        <>
          <HtmlTitle>{`Résultat - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteCreationResult />
        </>
      );
  }
}

export default SiteCreationCustomStepContent;
