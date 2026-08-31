import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import SiteNamingIntroduction from "./SiteNamingIntroduction";

function SiteNamingIntroductionContainer() {
  const { onBack, onNext } = useCustomSiteForm();

  return (
    <SiteNamingIntroduction
      onNext={onNext}
      onBack={() => {
        onBack();
      }}
    />
  );
}

export default SiteNamingIntroductionContainer;
