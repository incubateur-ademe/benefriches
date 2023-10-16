import { FricheCreationStep } from "../../application/createFriche.reducer";
import FricheFullTimeJobsInvolvedForm from "./site-management/full-time-jobs";
import FricheManagementIntroduction from "./site-management/introduction";
import FricheOwnerForm from "./site-management/owner";
import FricheRecentAccidentsForm from "./site-management/recent-accidents";
import FricheTenantForm from "./site-management/tenant";
import FricheNameAndDescriptionForm from "./denomination";
import FricheLastActivityForm from "./last-activity";
import NaturalAndAgriculturalSoilsForm from "./natural-and-agricultural-soils";
import SoilContaminationForm from "./soil-contamination";
import FricheSoilIntroduction from "./soil-introduction";
import FricheSoilsForm from "./soils";
import FricheSoilsCarbonSequestration from "./soils-carbon-sequestration";
import FricheSoilSummary from "./soils-summary";
import FricheSoilsSurfaceAreasForm from "./soils-surface-areas";
import FricheCreationStepper from "./Stepper";
import FricheSurfaceAreaForm from "./surface-area";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function FricheCreationWizard() {
  const fricheCreationState = useAppSelector((state) => state.fricheCreation);

  const getStepComponent = () => {
    switch (fricheCreationState.step) {
      case FricheCreationStep.SOIL_INTRODUCTION:
        return <FricheSoilIntroduction />;
      case FricheCreationStep.SURFACE_AREA:
        return <FricheSurfaceAreaForm />;
      case FricheCreationStep.SOILS:
        return <FricheSoilsForm />;
      case FricheCreationStep.NATURAL_OR_AGRICULTURAL_SOILS:
        return <NaturalAndAgriculturalSoilsForm />;
      case FricheCreationStep.SOILS_SURFACE_AREAS:
        return <FricheSoilsSurfaceAreasForm />;
      case FricheCreationStep.SOILS_SUMMARY:
        return <FricheSoilSummary />;
      case FricheCreationStep.SOILS_CARBON_STORAGE:
        return <FricheSoilsCarbonSequestration />;
      case FricheCreationStep.LAST_ACTIVITY_STEP:
        return <FricheLastActivityForm />;
      case FricheCreationStep.SOIL_CONTAMINATION:
        return <SoilContaminationForm />;
      case FricheCreationStep.MANAGEMENT_INTRODUCTION:
        return <FricheManagementIntroduction />;
      case FricheCreationStep.OWNER:
        return <FricheOwnerForm />;
      case FricheCreationStep.TENANT:
        return <FricheTenantForm />;
      case FricheCreationStep.FULL_TIME_JOBS_INVOLVED:
        return <FricheFullTimeJobsInvolvedForm />;
      case FricheCreationStep.RECENT_ACCIDENTS:
        return <FricheRecentAccidentsForm />;
      case FricheCreationStep.NAMING_STEP:
        return <FricheNameAndDescriptionForm />;
    }
  };

  return (
    <>
      <FricheCreationStepper step={fricheCreationState.step} />
      {getStepComponent()}
    </>
  );
}

export default FricheCreationWizard;
