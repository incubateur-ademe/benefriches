import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import BuildingsUseIntroduction from "./BuildingsUseIntroduction";

export default function BuildingsUseIntroductionContainer() {
  const { onBack, onNext } = useProjectForm();

  return <BuildingsUseIntroduction onNext={onNext} onBack={onBack} />;
}
