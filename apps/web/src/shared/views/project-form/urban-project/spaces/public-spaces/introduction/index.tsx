import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import PublicSpacesIntroduction from "./PublicSpacesIntroduction";

export default function PublicSpacesIntroductionContainer() {
  const { onBack, onNext, selectStepAnswers } = useProjectForm();

  const spacesCategoriesDistribution = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA"),
  )?.spacesCategoriesDistribution;

  return (
    <PublicSpacesIntroduction
      onNext={onNext}
      onBack={onBack}
      publicSpacesSurfaceArea={spacesCategoriesDistribution?.PUBLIC_SPACES ?? 0}
    />
  );
}
