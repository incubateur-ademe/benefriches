import {
  namingIntroductionStepCompleted,
  namingIntroductionStepReverted,
} from "@/features/create-site/core/actions/naming.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import SiteNamingIntroduction from "./SiteNamingIntroduction";

function SiteNamingIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <SiteNamingIntroduction
      onNext={() => dispatch(namingIntroductionStepCompleted())}
      onBack={() => {
        dispatch(namingIntroductionStepReverted());
      }}
    />
  );
}

export default SiteNamingIntroductionContainer;
