import { FricheCreationStep } from "../../application/createFriche.reducers";
import FricheLastActivityForm from "./last-activity";
import PermeableArtificializedSoilForm from "./permeable-artificialized-soil-composition";
import PermeableArtificializedSoilDistributionForm from "./permeable-artificialized-soil-distribution";
import FricheSpacesForm from "./spaces";
import FricheSpacesSurfaceAreaForm from "./spaces-surface-area";
import FricheCreationStepper from "./Stepper";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

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
      case FricheCreationStep.PERMEABLE_ARTIFICIAL_SOILS_COMPOSITION:
        return <PermeableArtificializedSoilForm />;
      case FricheCreationStep.PERMEABLE_ARTIFICIAL_SOILS_DISTRIBUTION:
        return <PermeableArtificializedSoilDistributionForm />;
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
