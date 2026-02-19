import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { fricheAccidentsIntroductionStepCompleted } from "@/features/create-site/core/steps/contamination-and-accidents/contaminationAndAccidents.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import FricheAccidentsIntroduction from "./FricheAccidentsIntroduction";

function FricheAccidentsIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <FricheAccidentsIntroduction
      onBack={() => {
        dispatch(stepReverted());
      }}
      onNext={() => {
        dispatch(fricheAccidentsIntroductionStepCompleted());
      }}
    />
  );
}

export default FricheAccidentsIntroductionContainer;
