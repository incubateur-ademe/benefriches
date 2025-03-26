import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { completeSoilsTransformationIntroductionStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import SoilsTransformationIntroduction from "./SoilsTransformationIntroduction";

function SoilsTransformationIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <SoilsTransformationIntroduction
      onNext={() => dispatch(completeSoilsTransformationIntroductionStep())}
      onBack={() => dispatch(stepRevertAttempted())}
    />
  );
}

export default SoilsTransformationIntroductionContainer;
