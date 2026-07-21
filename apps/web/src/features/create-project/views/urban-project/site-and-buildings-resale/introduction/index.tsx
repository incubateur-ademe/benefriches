import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";

import SiteResaleIntroduction from "./SiteResaleIntroduction";

function SiteResaleIntroductionContainer() {
  const { onBack, onNext } = useProjectForm();

  return <SiteResaleIntroduction onNext={onNext} onBack={onBack} />;
}

export default SiteResaleIntroductionContainer;
