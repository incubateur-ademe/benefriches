import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

import UrbanZoneSoilsContaminationIntroduction from "./UrbanZoneSoilsContaminationIntroduction";

function SoilsContaminationIntroductionContainer() {
  const { onBack, onNext } = useUrbanZoneSiteForm();

  return <UrbanZoneSoilsContaminationIntroduction onNext={onNext} onBack={onBack} />;
}

export default SoilsContaminationIntroductionContainer;
