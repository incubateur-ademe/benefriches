import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import UrbanGreenSpacesIntroduction from "./UrbanGreenSpacesIntroduction";

export default function UrbanGreenSpacesIntroductionContainer() {
  const { onBack, onNext, selectStepAnswers } = useProjectForm();

  const spacesCategoriesDistribution = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA"),
  )?.spacesCategoriesDistribution;

  return (
    <UrbanGreenSpacesIntroduction
      greenSpacesSurfaceArea={spacesCategoriesDistribution?.GREEN_SPACES ?? 0}
      onBack={onBack}
      onNext={onNext}
    />
  );
}
