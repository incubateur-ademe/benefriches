import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import BuildingsReuseIntroduction from "./BuildingsReuseIntroduction";

export default function BuildingsReuseIntroductionContainer() {
  const { onBack, onNext } = useProjectForm();

  return <BuildingsReuseIntroduction onBack={onBack} onNext={onNext} />;
}
