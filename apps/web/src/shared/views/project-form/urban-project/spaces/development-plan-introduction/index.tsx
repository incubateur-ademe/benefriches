import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import UrbanSpacesDevelopmentPlanIntroduction from "./UrbanSpacesDevelopmentPlanIntroduction";

export default function UrbanSpacesDevelopmentPlanIntroductionContainer() {
  const { onBack, onNext } = useProjectForm();

  return <UrbanSpacesDevelopmentPlanIntroduction onNext={onNext} onBack={onBack} />;
}
