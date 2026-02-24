import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import PublicGreenSpacesIntroduction from "./PublicGreenSpacesIntroduction";

export default function PublicGreenSpacesIntroductionContainer() {
  const { onBack, onNext, selectPublicGreenSpacesIntroductionViewData } = useProjectForm();

  const { existingNaturalSoils } = useAppSelector(selectPublicGreenSpacesIntroductionViewData);

  return (
    <PublicGreenSpacesIntroduction
      existingNaturalSoils={existingNaturalSoils}
      onNext={onNext}
      onBack={onBack}
    />
  );
}
