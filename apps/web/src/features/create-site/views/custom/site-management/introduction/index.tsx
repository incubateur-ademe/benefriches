import {
  managementIntroductionCompleted,
  managementIntroductionReverted,
} from "@/features/create-site/core/actions/siteManagement.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteManagementIntroduction from "./SiteManagementIntroduction";

function SiteManagementIntroductionContainer() {
  const dispatch = useAppDispatch();
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);

  return (
    <SiteManagementIntroduction
      siteNature={siteNature}
      onNext={() => dispatch(managementIntroductionCompleted())}
      onBack={() => dispatch(managementIntroductionReverted())}
    />
  );
}

export default SiteManagementIntroductionContainer;
