import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import BuildingsIntroduction from "./BuildingsIntroduction";

export default function BuildingsIntroductionContainer() {
  const { onBack, onNext } = useProjectForm();

  return <BuildingsIntroduction onNext={onNext} onBack={onBack} />;
}
