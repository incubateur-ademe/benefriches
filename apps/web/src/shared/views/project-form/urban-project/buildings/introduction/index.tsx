import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import BuildingsIntroduction from "./BuildingsIntroduction";

export default function BuildingsIntroductionContainer() {
  const { selectStepAnswers, onBack, onNext } = useProjectForm();

  const livingAndActivitySpacesDistribution = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION"),
  )?.livingAndActivitySpacesDistribution;

  return (
    <BuildingsIntroduction
      onNext={onNext}
      onBack={onBack}
      buildingsFootprintSurfaceArea={livingAndActivitySpacesDistribution?.BUILDINGS ?? 0}
    />
  );
}
