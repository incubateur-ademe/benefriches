import FricheSpacesSurfaceAreaForm from "./FricheSpacesSurfaceArea";
import FricheLastActivityForm from "./last-activity";
import FricheSpacesForm from "./spaces";
import FricheCreationStepper from "./Stepper";

import {
  FricheSite,
  FricheSpaceType,
} from "@/components/pages/SiteFoncier/friche";
import {
  FricheCreationStep,
  setSpacesSurfaceArea,
} from "@/store/features/fricheCreation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

function FricheCreationWizard() {
  const dispatch = useAppDispatch();
  const fricheCreationState = useAppSelector((state) => state.fricheCreation);

  const getStepComponent = () => {
    switch (fricheCreationState.step) {
      case FricheCreationStep.LAST_ACTIVITY_STEP:
        return <FricheLastActivityForm />;
      case FricheCreationStep.SPACES_STEP:
        return <FricheSpacesForm />;
      case FricheCreationStep.SPACES_SURFACE_AREA_STEP:
        return (
          <FricheSpacesSurfaceAreaForm
            spaces={
              fricheCreationState.fricheData.spaces as FricheSite["spaces"]
            }
            onSubmit={(data) => {
              const spaces = Object.entries(data).map(([type, surface]) => ({
                type: type as FricheSpaceType,
                surface,
              }));
              dispatch(setSpacesSurfaceArea(spaces));
            }}
          />
        );
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
