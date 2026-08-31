import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import SoilContaminationIntroduction from "./SoilContaminationIntroduction";

function SoilContaminationIntroductionContainer() {
  const { onBack, onNext } = useCustomSiteForm();

  return (
    <SoilContaminationIntroduction
      onBack={() => {
        onBack();
      }}
      onNext={() => {
        onNext();
      }}
    />
  );
}

export default SoilContaminationIntroductionContainer;
