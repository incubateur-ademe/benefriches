import { useInformationalStepBackNext } from "../../useInformationalStepBackNext";
import UrbanSpacesDevelopmentPlanIntroduction from "./UrbanSpacesDevelopmentPlanIntroduction";

export default function UrbanSpacesDevelopmentPlanIntroductionContainer() {
  const { onBack, onNext } = useInformationalStepBackNext();

  return <UrbanSpacesDevelopmentPlanIntroduction onNext={onNext} onBack={onBack} />;
}
