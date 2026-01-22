import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import SpacesIntroduction from "./SpacesIntroduction";

export default function SpacesIntroductionContainer() {
  const { onBack, onNext } = useProjectForm();

  return <SpacesIntroduction onNext={onNext} onBack={onBack} />;
}
