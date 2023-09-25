import { SiteFoncierType } from "../siteFoncier";
import SiteFoncierCreationStepAddress from "./Steps/Address";
import FricheCreationWizard from "./Steps/friche/FricheCreationWizard";
import FricheCreationStepper from "./Steps/friche/Stepper";
import NaturalAreaCreationWizard from "./Steps/natural-area";
import SiteFoncierCreationStepType from "./Steps/Type";

import {
  CreationStep,
  setAddress,
  setSiteType,
} from "@/store/features/siteCreation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

function CreateSiteFoncierPage() {
  const dispatch = useAppDispatch();
  const siteCreationState = useAppSelector((state) => state.siteCreation);

  const getStepComponent = () => {
    switch (siteCreationState.step) {
      case CreationStep.TYPE_STEP:
        return (
          <SiteFoncierCreationStepType
            onSubmit={(data) => {
              dispatch(setSiteType(data.type));
            }}
          />
        );
      case CreationStep.ADDRESS_STEP:
        return (
          <SiteFoncierCreationStepAddress
            siteType={siteCreationState.siteData.type as SiteFoncierType}
            onSubmit={(data) => dispatch(setAddress(data.location.address))}
            onBack={() => {}}
          />
        );
      case CreationStep.FRICHE_CREATION:
        return <FricheCreationWizard />;
      case CreationStep.NATURAL_SPACE_CREATION:
        return <NaturalAreaCreationWizard />;
    }
  };

  return (
    <>
      <FricheCreationStepper step={siteCreationState.step} />
      {getStepComponent()}
    </>
  );
}

export default CreateSiteFoncierPage;
