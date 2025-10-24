import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import LivingAndActivitySpacesIntroduction from "./LivingAndActivitySpacesIntroduction";

export default function LivingAndActivitySpacesIntroductionContainer() {
  const { onBack, onNext, selectStepAnswers } = useProjectForm();
  const spacesCategoriesDistribution = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA"),
  )?.spacesCategoriesDistribution;

  return (
    <LivingAndActivitySpacesIntroduction
      livingAndActivitySpacesSurfaceArea={
        spacesCategoriesDistribution?.LIVING_AND_ACTIVITY_SPACES ?? 0
      }
      onBack={onBack}
      onNext={onNext}
    />
  );
}
