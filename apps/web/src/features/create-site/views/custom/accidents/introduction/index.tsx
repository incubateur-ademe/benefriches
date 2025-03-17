import {
  fricheAccidentsIntroductionStepCompleted,
  fricheAccidentsIntroductionStepReverted,
} from "@/features/create-site/core/actions/soilsContaminationAndAccidents.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import FricheAccidentsIntroduction from "./FricheAccidentsIntroduction";

function FricheAccidentsIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <FricheAccidentsIntroduction
      onBack={() => {
        dispatch(fricheAccidentsIntroductionStepReverted());
      }}
      onNext={() => {
        dispatch(fricheAccidentsIntroductionStepCompleted());
      }}
    />
  );
}

export default FricheAccidentsIntroductionContainer;
