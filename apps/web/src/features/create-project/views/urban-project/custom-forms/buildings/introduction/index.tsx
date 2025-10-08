import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useInformationalStepBackNext } from "../../useInformationalStepBackNext";
import BuildingsIntroduction from "./BuildingsIntroduction";

export default function BuildingsIntroductionContainer() {
  const { livingAndActivitySpacesDistribution } =
    useAppSelector(
      selectStepAnswers("URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION"),
    ) ?? {};
  const { onNext, onBack } = useInformationalStepBackNext();

  return (
    <BuildingsIntroduction
      onNext={onNext}
      onBack={onBack}
      buildingsFootprintSurfaceArea={livingAndActivitySpacesDistribution?.BUILDINGS ?? 0}
    />
  );
}
