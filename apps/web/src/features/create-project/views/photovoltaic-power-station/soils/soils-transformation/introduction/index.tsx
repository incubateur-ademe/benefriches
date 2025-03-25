import { completeSoilsTransformationIntroductionStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { soilsTransformationIntroductionStepReverted } from "@/features/create-project/core/renewable-energy/actions/revert.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import SoilsTransformationIntroduction from "./SoilsTransformationIntroduction";

function SoilsTransformationIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <SoilsTransformationIntroduction
      onNext={() => dispatch(completeSoilsTransformationIntroductionStep())}
      onBack={() => dispatch(soilsTransformationIntroductionStepReverted())}
    />
  );
}

export default SoilsTransformationIntroductionContainer;
