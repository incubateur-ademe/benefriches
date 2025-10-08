import { useInformationalStepBackNext } from "../../useInformationalStepBackNext";
import BuildingsUseIntroduction from "./BuildingsUseIntroduction";

export default function BuildingsUseIntroductionContainer() {
  const { onBack, onNext } = useInformationalStepBackNext();

  return <BuildingsUseIntroduction onNext={onNext} onBack={onBack} />;
}
