import { useAppSelector } from "@/app/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import BuildingsFootprintToReuse from "./BuildingsFootprintToReuse";

export default function BuildingsFootprintToReuseContainer() {
  const { onBack, onRequestStepCompletion, selectBuildingsFootprintToReuseViewData } =
    useProjectForm();

  const { currentValue, siteBuildingsFootprint } = useAppSelector(
    selectBuildingsFootprintToReuseViewData,
  );

  return (
    <BuildingsFootprintToReuse
      initialValue={currentValue}
      siteBuildingsFootprint={siteBuildingsFootprint}
      onBack={onBack}
      onSubmit={(answers) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
          answers,
        });
      }}
    />
  );
}
