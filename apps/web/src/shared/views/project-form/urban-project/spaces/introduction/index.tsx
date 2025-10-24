import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import UrbanProjectSpacesIntroduction from "./SpacesIntroduction";

export default function UrbanProjectSpacesIntroductionContainer() {
  const { onBack, onNext } = useProjectForm();

  return <UrbanProjectSpacesIntroduction onNext={onNext} onBack={onBack} />;
}
