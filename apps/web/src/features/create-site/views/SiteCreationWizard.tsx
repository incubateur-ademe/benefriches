import { SiteCreationStep } from "../application/createSite.reducer";
import SiteExpensesSummary from "./site-management/expenses-summary";
import FricheSecuringCostsForm from "./site-management/friche-securing-costs";
import SiteFullTimeJobsInvolvedForm from "./site-management/full-time-jobs";
import SiteManagementIntroduction from "./site-management/introduction";
import SiteOwnerForm from "./site-management/owner";
import FricheRecentAccidentsForm from "./site-management/recent-accidents";
import SoilsDegradationYearlyExpenses from "./site-management/soils-degradation-yearly-expenses";
import SiteTenantForm from "./site-management/tenant";
import SiteYearlyExpensesForm from "./site-management/yearly-expenses";
import SiteYearlyIncomeForm from "./site-management/yearly-income";
import SiteSoilsCarbonSequestration from "./soils/soils-carbon-sequestration";
import SiteSoilsIntroduction from "./soils/soils-introduction";
import SiteSoilsForm from "./soils/soils-selection";
import SiteSoilsSummary from "./soils/soils-summary";
import SiteSoilsSurfaceAreasForm from "./soils/soils-surface-areas";
import AddressForm from "./address";
import SiteCreationConfirmation from "./confirmation";
import SiteNameAndDescriptionForm from "./denomination";
import FricheActivityForm from "./friche-activity";
import SiteTypeForm from "./site-type";
import SoilContaminationForm from "./soil-contamination";
import Stepper from "./Stepper";
import SiteSurfaceAreaForm from "./surface-area";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function SiteCreationWizard() {
  const siteCreationState = useAppSelector((state) => state.siteCreation);

  const getStepComponent = () => {
    switch (siteCreationState.step) {
      case SiteCreationStep.SITE_TYPE:
        return <SiteTypeForm />;
      case SiteCreationStep.ADDRESS:
        return <AddressForm />;
      case SiteCreationStep.SOILS_INTRODUCTION:
        return <SiteSoilsIntroduction />;
      case SiteCreationStep.SURFACE_AREA:
        return <SiteSurfaceAreaForm />;
      case SiteCreationStep.SOILS:
        return <SiteSoilsForm />;
      case SiteCreationStep.SOILS_SURFACE_AREAS:
        return <SiteSoilsSurfaceAreasForm />;
      case SiteCreationStep.SOILS_SUMMARY:
        return <SiteSoilsSummary />;
      case SiteCreationStep.SOILS_CARBON_SEQUESTRATION:
        return <SiteSoilsCarbonSequestration />;
      case SiteCreationStep.SOIL_CONTAMINATION:
        return <SoilContaminationForm />;
      case SiteCreationStep.MANAGEMENT_INTRODUCTION:
        return <SiteManagementIntroduction />;
      case SiteCreationStep.OWNER:
        return <SiteOwnerForm />;
      case SiteCreationStep.TENANT:
        return <SiteTenantForm />;
      case SiteCreationStep.FULL_TIME_JOBS_INVOLVED:
        return <SiteFullTimeJobsInvolvedForm />;
      case SiteCreationStep.RECENT_ACCIDENTS:
        return <FricheRecentAccidentsForm />;
      case SiteCreationStep.FRICHE_SECURING_EXPENSES:
        return <FricheSecuringCostsForm />;
      case SiteCreationStep.YEARLY_EXPENSES:
        return <SiteYearlyExpensesForm />;
      case SiteCreationStep.YEARLY_INCOME:
        return <SiteYearlyIncomeForm />;
      case SiteCreationStep.SOILS_DEGRADATION_YEARLY_EXPENSES:
        return <SoilsDegradationYearlyExpenses />;
      case SiteCreationStep.EXPENSES_SUMMARY:
        return <SiteExpensesSummary />;
      case SiteCreationStep.FRICHE_ACTIVITY:
        return <FricheActivityForm />;
      case SiteCreationStep.NAMING:
        return <SiteNameAndDescriptionForm />;
      case SiteCreationStep.CREATION_CONFIRMATION:
        return <SiteCreationConfirmation />;
    }
  };

  return (
    <>
      <Stepper
        isFriche={siteCreationState.siteData.isFriche}
        step={siteCreationState.step}
      />
      {getStepComponent()}
    </>
  );
}

export default SiteCreationWizard;
