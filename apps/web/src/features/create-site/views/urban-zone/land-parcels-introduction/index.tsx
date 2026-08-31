import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import LandParcelsIntroduction from "./LandParcelsIntroduction";

function LandParcelsIntroductionContainer() {
  const { onBack, onNext } = useCustomSiteForm();

  return <LandParcelsIntroduction onNext={onNext} onBack={onBack} />;
}

export default LandParcelsIntroductionContainer;
