import { useAppDispatch } from "@/app/hooks/store.hooks";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/custom/custom.actions";

import SoilContaminationIntroduction from "./SoilContaminationIntroduction";

function SoilContaminationIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <SoilContaminationIntroduction
      onBack={() => {
        dispatch(previousStepRequested());
      }}
      onNext={() => {
        dispatch(nextStepRequested());
      }}
    />
  );
}

export default SoilContaminationIntroductionContainer;
