import { fr } from "@codegouvfr/react-dsfr";
import { selectCurrentStep } from "../application/createSite.reducer";
import SiteExpensesSummary from "./site-management/expenses-summary";
import SiteFullTimeJobsInvolvedForm from "./site-management/full-time-jobs";
import SiteManagementIntroduction from "./site-management/introduction";
import SiteOwnerForm from "./site-management/owner";
import FricheRecentAccidentsForm from "./site-management/recent-accidents";
import SiteTenantForm from "./site-management/tenant";
import SiteYearlyExpensesForm from "./site-management/yearly-expenses";
import SiteYearlyIncomeForm from "./site-management/yearly-income";
import SiteSoilsCarbonStorage from "./soils/soils-carbon-storage";
import SiteSoilsDistributionAccuracySelection from "./soils/soils-distribution/accuracy-selection";
import SiteSoilsDistribution from "./soils/soils-distribution/distribution";
import SiteSoilsIntroduction from "./soils/soils-introduction";
import SiteSoilsForm from "./soils/soils-selection";
import SiteSoilsSummary from "./soils/soils-summary";
import SiteSurfaceAreaForm from "./soils/surface-area";
import AddressForm from "./address";
import SiteCreationConfirmation from "./confirmation";
import SiteNameAndDescriptionForm from "./denomination";
import FricheActivityForm from "./friche-activity";
import SiteTypeForm from "./site-type";
import SoilContaminationForm from "./soil-contamination";
import Stepper from "./Stepper";
import SiteDataSummary from "./summary";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function SiteCreationWizard() {
  const currentStep = useAppSelector(selectCurrentStep);
  const siteData = useAppSelector((state) => state.siteCreation.siteData);

  const getStepComponent = () => {
    switch (currentStep) {
      case "SITE_TYPE":
        return <SiteTypeForm />;
      case "ADDRESS":
        return <AddressForm />;
      case "SOILS_INTRODUCTION":
        return <SiteSoilsIntroduction />;
      case "SURFACE_AREA":
        return <SiteSurfaceAreaForm />;
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
      case "SOILS_CONTAMINATION":
        return <SoilContaminationForm />;
      case "MANAGEMENT_INTRODUCTION":
        return <SiteManagementIntroduction />;
      case "OWNER":
        return <SiteOwnerForm />;
      case "TENANT":
        return <SiteTenantForm />;
      case "FULL_TIME_JOBS_INVOLVED":
        return <SiteFullTimeJobsInvolvedForm />;
      case "FRICHE_RECENT_ACCIDENTS":
        return <FricheRecentAccidentsForm />;
      case "YEARLY_EXPENSES":
        return <SiteYearlyExpensesForm />;
      case "YEARLY_INCOME":
        return <SiteYearlyIncomeForm />;
      case "YEARLY_EXPENSES_SUMMARY":
        return <SiteExpensesSummary />;
      case "FRICHE_ACTIVITY":
        return <FricheActivityForm />;
      case "NAMING":
        return <SiteNameAndDescriptionForm />;
      case "FINAL_SUMMARY":
        return <SiteDataSummary />;
      case "CREATION_CONFIRMATION":
        return <SiteCreationConfirmation />;
    }
  };

  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <Stepper isFriche={siteData.isFriche} step={currentStep} />
      {getStepComponent()}
    </section>
  );
}

export default SiteCreationWizard;
