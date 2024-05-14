import SoilsTransformationIntroduction from "./SoilsTransformationIntroduction";

import {
  completeSoilsTransformationIntroductionStep,
  revertSoilsTransformationIntroductionStep,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function SoilsTransformationIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <SoilsTransformationIntroduction
      onNext={() => dispatch(completeSoilsTransformationIntroductionStep())}
      onBack={() => dispatch(revertSoilsTransformationIntroductionStep())}
    />
  );
}

export default SoilsTransformationIntroductionContainer;
