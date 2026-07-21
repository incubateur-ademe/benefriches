import { useAppSelector } from "@/app/hooks/store.hooks";
import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";

import BuildingsNewConstructionInfo from "./BuildingsNewConstructionInfo";

export default function BuildingsNewConstructionInfoContainer() {
  const { onBack, onNext, selectBuildingsNewConstructionInfoViewData } = useProjectForm();

  const { buildingsFootprintToConstruct } = useAppSelector(
    selectBuildingsNewConstructionInfoViewData,
  );

  return (
    <BuildingsNewConstructionInfo
      buildingsFootprintToConstruct={buildingsFootprintToConstruct}
      onBack={onBack}
      onNext={onNext}
    />
  );
}
