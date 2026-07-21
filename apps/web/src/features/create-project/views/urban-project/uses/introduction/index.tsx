import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";

import UsesIntroduction from "./UsesIntroduction";

export default function UsesIntroductionContainer() {
  const { onBack, onNext } = useProjectForm();

  return <UsesIntroduction onNext={onNext} onBack={onBack} />;
}
