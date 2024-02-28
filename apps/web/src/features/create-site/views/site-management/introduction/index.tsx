import SiteManagementIntroduction from "./SiteManagementIntroduction";

import { completeManagementIntroduction } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function SiteManagementIntroductionContainer() {
  const dispatch = useAppDispatch();

  return <SiteManagementIntroduction onNext={() => dispatch(completeManagementIntroduction())} />;
}

export default SiteManagementIntroductionContainer;
