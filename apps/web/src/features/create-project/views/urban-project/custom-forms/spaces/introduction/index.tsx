import { useInformationalStepBackNext } from "../../useInformationalStepBackNext";
import UrbanProjectSpacesIntroduction from "./SpacesIntroduction";

export default function UrbanProjectSpacesIntroductionContainer() {
  const { onBack, onNext } = useInformationalStepBackNext();

  return <UrbanProjectSpacesIntroduction onNext={onNext} onBack={onBack} />;
}
