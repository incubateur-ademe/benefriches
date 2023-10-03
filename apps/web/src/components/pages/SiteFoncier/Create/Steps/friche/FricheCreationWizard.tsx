import FricheLastActivityForm from "./last-activity";
import FricheSpacesForm from "./spaces";
import FricheSpacesSurfaceAreaForm from "./spaces-surface-area";
import FricheCreationStepper from "./Stepper";

import { FricheCreationStep } from "@/store/features/fricheCreation";
import { useAppSelector } from "@/store/hooks";

function FricheCreationWizard() {
  const fricheCreationState = useAppSelector((state) => state.fricheCreation);

  const getStepComponent = () => {
    switch (fricheCreationState.step) {
      case FricheCreationStep.LAST_ACTIVITY_STEP:
        return <FricheLastActivityForm />;
      case FricheCreationStep.SPACES_STEP:
        return <FricheSpacesForm />;
      case FricheCreationStep.SPACES_SURFACE_AREA_STEP:
        return <FricheSpacesSurfaceAreaForm />;
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
