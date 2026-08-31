import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import SiteSpacesIntroduction from "./SpacesIntroduction";

function SiteSpacesIntroductionContainer() {
  const { onBack, onNext, selectSiteNature } = useCustomSiteForm();
  const siteNature = useAppSelector(selectSiteNature);

  return (
    <SiteSpacesIntroduction
      siteNature={siteNature}
      onNext={onNext}
      onBack={() => {
        onBack();
      }}
    />
  );
}

export default SiteSpacesIntroductionContainer;
