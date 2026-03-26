import { useAppSelector } from "@/app/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import BuildingsNewConstructionIntroduction from "./BuildingsNewConstructionIntroduction";

export default function BuildingsNewConstructionIntroductionContainer() {
  const { onBack, onNext, selectBuildingsNewConstructionIntroductionViewData } = useProjectForm();

  const { buildingsFootprintToConstruct } = useAppSelector(
    selectBuildingsNewConstructionIntroductionViewData,
  );

  return (
    <BuildingsNewConstructionIntroduction
      buildingsFootprintToConstruct={buildingsFootprintToConstruct}
      onBack={onBack}
      onNext={onNext}
    />
  );
}
