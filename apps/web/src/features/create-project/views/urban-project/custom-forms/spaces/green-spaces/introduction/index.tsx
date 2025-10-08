import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useInformationalStepBackNext } from "../../../useInformationalStepBackNext";
import UrbanGreenSpacesIntroduction from "./UrbanGreenSpacesIntroduction";

export default function UrbanGreenSpacesIntroductionContainer() {
  const { spacesCategoriesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA")) ?? {};

  const { onNext, onBack } = useInformationalStepBackNext();
  return (
    <UrbanGreenSpacesIntroduction
      greenSpacesSurfaceArea={spacesCategoriesDistribution?.GREEN_SPACES ?? 0}
      onBack={onNext}
      onNext={onBack}
    />
  );
}
