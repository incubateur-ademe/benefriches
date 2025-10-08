import { useInformationalStepBackNext } from "../../useInformationalStepBackNext";
import SiteResaleIntroduction from "./SiteResaleIntroduction";

function SiteResaleIntroductionContainer() {
  const { onBack, onNext } = useInformationalStepBackNext();

  return <SiteResaleIntroduction onNext={onNext} onBack={onBack} />;
}

export default SiteResaleIntroductionContainer;
