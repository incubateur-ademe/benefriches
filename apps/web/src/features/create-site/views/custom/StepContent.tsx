import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import { selectCurrentStep } from "../../core/createSite.reducer";
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
import SiteSoilsCarbonStorage from "./soils/soils-carbon-storage";
import SiteSoilsDistributionAccuracySelection from "./soils/soils-distribution/accuracy-selection";
import SiteSoilsDistribution from "./soils/soils-distribution/distribution";
import SiteSoilsIntroduction from "./soils/soils-introduction";
import SiteSoilsForm from "./soils/soils-selection";
import SiteSoilsSummary from "./soils/soils-summary";
import SpacesKnowledgeForm from "./soils/spaces-knowledge";
import SiteSurfaceAreaForm from "./soils/surface-area";
import SiteDataSummary from "./summary";

function SiteCreationCustomStepContent() {
  const currentStep = useAppSelector(selectCurrentStep);

  switch (currentStep) {
    case "FRICHE_ACTIVITY":
      return <FricheActivityForm />;
    case "AGRICULTURAL_OPERATION_ACTIVITY":
      return <AgriculturalOperationActivityForm />;
    case "NATURAL_AREA_TYPE":
      return <NaturalAreaTypeForm />;
    case "ADDRESS":
      return <AddressForm />;
    case "SOILS_INTRODUCTION":
      return <SiteSoilsIntroduction />;
    case "SURFACE_AREA":
      return <SiteSurfaceAreaForm />;
    case "SPACES_KNOWLEDGE":
      return <SpacesKnowledgeForm />;
    case "SOILS_SELECTION":
      return <SiteSoilsForm />;
    case "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE":
      return <SiteSoilsDistributionAccuracySelection />;
    case "SOILS_SURFACE_AREAS_DISTRIBUTION":
      return <SiteSoilsDistribution />;
    case "SOILS_SUMMARY":
      return <SiteSoilsSummary />;
    case "SOILS_CARBON_STORAGE":
      return <SiteSoilsCarbonStorage />;
    case "SOILS_CONTAMINATION_INTRODUCTION":
      return <SoilContaminationIntroduction />;
    case "SOILS_CONTAMINATION":
      return <SoilContaminationForm />;
    case "FRICHE_ACCIDENTS_INTRODUCTION":
      return <FricheAccidentsIntroduction />;
    case "FRICHE_ACCIDENTS":
      return <FricheAccidentsForm />;
    case "MANAGEMENT_INTRODUCTION":
      return <SiteManagementIntroduction />;
    case "OWNER":
      return <SiteOwnerForm />;
    case "IS_FRICHE_LEASED":
      return <IsFricheLeasedForm />;
    case "IS_SITE_OPERATED":
      return <IsSiteOperatedForm />;
    case "OPERATOR":
      return <SiteOperatorForm />;
    case "TENANT":
      return <SiteTenantForm />;
    case "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION":
      return <SiteExpensesAndIncomeIntroduction />;
    case "YEARLY_EXPENSES":
      return <SiteYearlyExpensesForm />;
    case "YEARLY_INCOME":
      return <SiteYearlyIncomeForm />;
    case "YEARLY_EXPENSES_SUMMARY":
      return <SiteExpensesIncomeSummary />;
    case "NAMING_INTRODUCTION":
      return <SiteNamingIntroduction />;
    case "NAMING":
      return <SiteNameAndDescriptionForm />;
    case "FINAL_SUMMARY":
      return <SiteDataSummary />;
    case "CREATION_RESULT":
      return <SiteCreationResult />;
  }
}

export default SiteCreationCustomStepContent;
