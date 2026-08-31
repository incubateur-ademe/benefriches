import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/custom/custom.actions";
import { selectSiteNature } from "@/features/create-site/core/selectors/createSite.selectors";

import SiteManagementIntroduction from "./SiteManagementIntroduction";

function SiteManagementIntroductionContainer() {
  const dispatch = useAppDispatch();
  const siteNature = useAppSelector(selectSiteNature);

  return (
    <SiteManagementIntroduction
      siteNature={siteNature}
      onNext={() => dispatch(nextStepRequested())}
      onBack={() => dispatch(previousStepRequested())}
    />
  );
}

export default SiteManagementIntroductionContainer;
