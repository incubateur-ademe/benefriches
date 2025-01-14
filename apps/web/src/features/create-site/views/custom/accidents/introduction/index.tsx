import { revertFricheAccidentsIntroductionStep } from "@/features/create-site/core/actions/createSite.actions";
import { completeFricheAccidentsIntroduction } from "@/features/create-site/core/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import FricheAccidentsIntroduction from "./FricheAccidentsIntroduction";

function FricheAccidentsIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <FricheAccidentsIntroduction
      onBack={() => {
        dispatch(revertFricheAccidentsIntroductionStep());
      }}
      onNext={() => {
        dispatch(completeFricheAccidentsIntroduction());
      }}
    />
  );
}

export default FricheAccidentsIntroductionContainer;
