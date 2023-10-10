import { FricheCreationStep } from "../../application/createFriche.reducers";
import FricheLastActivityForm from "./last-activity";
import NaturalAndAgriculturalSoilsForm from "./natural-and-agricultural-soils";
import SoilContaminationForm from "./soil-contamination";
import FricheSoilIntroduction from "./soil-introduction";
import FricheSoilsForm from "./soils";
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
      case FricheCreationStep.LAST_ACTIVITY_STEP:
        return <FricheLastActivityForm />;
      case FricheCreationStep.SOIL_CONTAMINATION:
        return <SoilContaminationForm />;
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
