import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useInformationalStepBackNext } from "../../../useInformationalStepBackNext";
import LivingAndActivitySpacesIntroduction from "./LivingAndActivitySpacesIntroduction";

export default function LivingAndActivitySpacesIntroductionContainer() {
  const { spacesCategoriesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA")) ?? {};

  const { onNext, onBack } = useInformationalStepBackNext();

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
