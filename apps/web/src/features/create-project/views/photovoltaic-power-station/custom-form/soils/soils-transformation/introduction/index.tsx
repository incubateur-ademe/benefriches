import { useAppDispatch } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { completeSoilsTransformationIntroductionStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";

import SoilsTransformationIntroduction from "./SoilsTransformationIntroduction";

function SoilsTransformationIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <SoilsTransformationIntroduction
      onNext={() => dispatch(completeSoilsTransformationIntroductionStep())}
      onBack={() => dispatch(stepReverted())}
    />
  );
}

export default SoilsTransformationIntroductionContainer;
