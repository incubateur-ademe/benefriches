import { useAppSelector } from "@/app/hooks/store.hooks";
import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";

import BuildingsDemolitionInfo from "./BuildingsDemolitionInfo";

export default function BuildingsDemolitionInfoContainer() {
  const { onBack, onNext, selectBuildingsDemolitionInfoViewData } = useProjectForm();

  const { buildingsFootprintToDemolish } = useAppSelector(selectBuildingsDemolitionInfoViewData);

  return (
    <BuildingsDemolitionInfo
      buildingsFootprintToDemolish={buildingsFootprintToDemolish}
      onBack={onBack}
      onNext={onNext}
    />
  );
}
