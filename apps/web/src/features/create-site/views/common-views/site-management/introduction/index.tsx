import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import SiteManagementIntroduction from "./SiteManagementIntroduction";

function SiteManagementIntroductionContainer() {
  const { onBack, onNext, selectSiteNature } = useCustomSiteForm();
  const siteNature = useAppSelector(selectSiteNature);

  return <SiteManagementIntroduction siteNature={siteNature} onNext={onNext} onBack={onBack} />;
}

export default SiteManagementIntroductionContainer;
