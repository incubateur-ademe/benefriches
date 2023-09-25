import { FricheSite, FricheSpaceType } from "../../../siteFoncier";
import SiteFoncierCreationStepFricheLastActivity from "./FricheLastActivity";
import FricheSpacesSurfaceAreaForm from "./FricheSpacesSurfaceArea";
import FricheSpacesTypeForm from "./FricheSpacesType";
import FricheCreationStepper from "./Stepper";

import {
  FricheCreationStep,
  setLastActivity,
  setSpacesSurfaceArea,
  setSpacesTypes,
} from "@/store/features/fricheCreation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

function FricheCreationWizard() {
  const dispatch = useAppDispatch();
  const fricheCreationState = useAppSelector((state) => state.fricheCreation);

  const getStepComponent = () => {
    switch (fricheCreationState.step) {
      case FricheCreationStep.LAST_ACTIVITY_STEP:
        return (
          <SiteFoncierCreationStepFricheLastActivity
            onSubmit={(data) => {
              dispatch(setLastActivity(data.lastActivity));
            }}
            onBack={() => {}}
          />
        );
      case FricheCreationStep.SPACES_STEP:
        return (
          <FricheSpacesTypeForm
            onSubmit={(data) => {
              const spaces = Object.entries(data)
                .filter(([, value]) => {
                  return value === true;
                })
                .map(([spaceType]) => {
                  return { type: spaceType as FricheSpaceType };
                });
              dispatch(setSpacesTypes(spaces));
            }}
            onBack={() => {}}
          />
        );
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
