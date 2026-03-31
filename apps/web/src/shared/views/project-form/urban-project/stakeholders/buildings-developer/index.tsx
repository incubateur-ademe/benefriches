import { useAppSelector } from "@/app/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import StakeholdersBuildingsDeveloper from "./StakeholdersBuildingsDeveloper";

function getInitialValues(
  developerWillBeBuildingsConstructor: boolean | undefined,
): { developerWillBeBuildingsConstructor: "yes" | "no" } | undefined {
  if (developerWillBeBuildingsConstructor === undefined) {
    return undefined;
  }

  return {
    developerWillBeBuildingsConstructor: developerWillBeBuildingsConstructor ? "yes" : "no",
  };
}

export default function StakeholdersBuildingsDeveloperContainer() {
  const { onBack, onRequestStepCompletion, selectBuildingsDeveloperViewData } = useProjectForm();
  const { developerWillBeBuildingsConstructor } = useAppSelector(selectBuildingsDeveloperViewData);
  const initialValues = getInitialValues(developerWillBeBuildingsConstructor);

  return (
    <StakeholdersBuildingsDeveloper
      initialValues={initialValues}
      onBack={onBack}
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
          answers: {
            developerWillBeBuildingsConstructor:
              formData.developerWillBeBuildingsConstructor === "yes",
          },
        });
      }}
    />
  );
}
