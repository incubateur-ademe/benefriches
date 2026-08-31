import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/custom/custom.actions";
import { selectSiteNature } from "@/features/create-site/core/selectors/createSite.selectors";

import SiteSpacesIntroduction from "./SpacesIntroduction";

function SiteSpacesIntroductionContainer() {
  const dispatch = useAppDispatch();
  const siteNature = useAppSelector(selectSiteNature);

  return (
    <SiteSpacesIntroduction
      siteNature={siteNature}
      onNext={() => dispatch(nextStepRequested())}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default SiteSpacesIntroductionContainer;
