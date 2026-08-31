import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import FricheAccidentsIntroduction from "./FricheAccidentsIntroduction";

function FricheAccidentsIntroductionContainer() {
  const { onBack, onNext } = useCustomSiteForm();

  return (
    <FricheAccidentsIntroduction
      onBack={() => {
        onBack();
      }}
      onNext={() => {
        onNext();
      }}
    />
  );
}

export default FricheAccidentsIntroductionContainer;
