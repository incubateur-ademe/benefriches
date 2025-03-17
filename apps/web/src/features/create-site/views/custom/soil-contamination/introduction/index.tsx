import {
  soilsContaminationIntroductionStepCompleted,
  soilsContaminationIntroductionStepReverted,
} from "@/features/create-site/core/actions/soilsContaminationAndAccidents.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import SoilContaminationIntroduction from "./SoilContaminationIntroduction";

function SoilContaminationIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <SoilContaminationIntroduction
      onBack={() => {
        dispatch(soilsContaminationIntroductionStepReverted());
      }}
      onNext={() => {
        dispatch(soilsContaminationIntroductionStepCompleted());
      }}
    />
  );
}

export default SoilContaminationIntroductionContainer;
