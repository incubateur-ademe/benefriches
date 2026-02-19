import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { managementIntroductionCompleted } from "@/features/create-site/core/steps/site-management/siteManagement.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteManagementIntroduction from "./SiteManagementIntroduction";

function SiteManagementIntroductionContainer() {
  const dispatch = useAppDispatch();
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);

  return (
    <SiteManagementIntroduction
      siteNature={siteNature}
      onNext={() => dispatch(managementIntroductionCompleted())}
      onBack={() => dispatch(stepReverted())}
    />
  );
}

export default SiteManagementIntroductionContainer;
