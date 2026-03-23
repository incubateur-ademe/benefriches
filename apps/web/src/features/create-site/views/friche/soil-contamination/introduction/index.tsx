import { useAppDispatch } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { soilsContaminationIntroductionStepCompleted } from "@/features/create-site/core/steps/contamination-and-accidents/contaminationAndAccidents.actions";

import SoilContaminationIntroduction from "./SoilContaminationIntroduction";

function SoilContaminationIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <SoilContaminationIntroduction
      onBack={() => {
        dispatch(stepReverted());
      }}
      onNext={() => {
        dispatch(soilsContaminationIntroductionStepCompleted());
      }}
    />
  );
}

export default SoilContaminationIntroductionContainer;
