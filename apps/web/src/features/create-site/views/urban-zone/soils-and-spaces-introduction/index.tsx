import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

import SoilsAndSpacesIntroduction from "./SoilsAndSpacesIntroduction";

function SoilsAndSpacesIntroductionContainer() {
  const { onBack, onNext } = useUrbanZoneSiteForm();

  return <SoilsAndSpacesIntroduction onNext={onNext} onBack={onBack} />;
}

export default SoilsAndSpacesIntroductionContainer;
