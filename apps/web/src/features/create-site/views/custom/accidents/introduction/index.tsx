import { stepRevertAttempted } from "@/features/create-site/core/actions/revert.actions";
import { fricheAccidentsIntroductionStepCompleted } from "@/features/create-site/core/actions/soilsContaminationAndAccidents.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import FricheAccidentsIntroduction from "./FricheAccidentsIntroduction";

function FricheAccidentsIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <FricheAccidentsIntroduction
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
      onNext={() => {
        dispatch(fricheAccidentsIntroductionStepCompleted());
      }}
    />
  );
}

export default FricheAccidentsIntroductionContainer;
