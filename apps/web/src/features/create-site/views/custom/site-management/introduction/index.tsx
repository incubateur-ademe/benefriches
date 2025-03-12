import {
  completeManagementIntroduction,
  revertStep,
} from "@/features/create-site/core/createSite.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteManagementIntroduction from "./SiteManagementIntroduction";

function SiteManagementIntroductionContainer() {
  const dispatch = useAppDispatch();
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);

  return (
    <SiteManagementIntroduction
      siteNature={siteNature}
      onNext={() => dispatch(completeManagementIntroduction())}
      onBack={() => dispatch(revertStep())}
    />
  );
}

export default SiteManagementIntroductionContainer;
