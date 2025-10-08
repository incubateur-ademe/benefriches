import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useInformationalStepBackNext } from "../../../useInformationalStepBackNext";
import PublicSpacesIntroduction from "./PublicSpacesIntroduction";

export default function PublicSpacesIntroductionContainer() {
  const { spacesCategoriesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA")) ?? {};

  const { onNext, onBack } = useInformationalStepBackNext();

  return (
    <PublicSpacesIntroduction
      onNext={onNext}
      onBack={onBack}
      publicSpacesSurfaceArea={spacesCategoriesDistribution?.PUBLIC_SPACES ?? 0}
    />
  );
}
