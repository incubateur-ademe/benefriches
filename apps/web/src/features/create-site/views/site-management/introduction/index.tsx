import SiteManagementIntroduction from "./SiteManagementIntroduction";

import {
  completeManagementIntroduction,
  revertStep,
} from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function SiteManagementIntroductionContainer() {
  const dispatch = useAppDispatch();
  const isFriche = useAppSelector((state) => state.siteCreation.siteData.isFriche ?? false);

  return (
    <SiteManagementIntroduction
      isFriche={isFriche}
      onNext={() => dispatch(completeManagementIntroduction())}
      onBack={() => dispatch(revertStep())}
    />
  );
}

export default SiteManagementIntroductionContainer;
