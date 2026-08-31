import { useAppDispatch } from "@/app/hooks/store.hooks";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/custom/custom.actions";

import SiteNamingIntroduction from "./SiteNamingIntroduction";

function SiteNamingIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <SiteNamingIntroduction
      onNext={() => dispatch(nextStepRequested())}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default SiteNamingIntroductionContainer;
