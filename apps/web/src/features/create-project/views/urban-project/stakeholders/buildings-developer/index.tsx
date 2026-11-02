import { useAppSelector } from "@/app/hooks/store.hooks";
import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";

import StakeholdersBuildingsDeveloper, { type FormValues } from "./StakeholdersBuildingsDeveloper";

const toYesNo = (value: boolean): "yes" | "no" => (value ? "yes" : "no");

function getInitialValues(
  developerWillBeBuildingsConstructor: boolean | undefined,
  buildingsResalePlannedAfterDevelopment: boolean | undefined,
): FormValues | undefined {
  if (developerWillBeBuildingsConstructor === undefined) {
    return undefined;
  }

  return {
    developerWillBeBuildingsConstructor: toYesNo(developerWillBeBuildingsConstructor),
    buildingsResalePlanned:
      buildingsResalePlannedAfterDevelopment === undefined
        ? undefined
        : toYesNo(buildingsResalePlannedAfterDevelopment),
  };
}

export default function StakeholdersBuildingsDeveloperContainer() {
  const { onBack, onRequestStepCompletion, selectBuildingsDeveloperViewData } = useProjectForm();
  const { developerWillBeBuildingsConstructor, buildingsResalePlannedAfterDevelopment } =
    useAppSelector(selectBuildingsDeveloperViewData);
  const initialValues = getInitialValues(
    developerWillBeBuildingsConstructor,
    buildingsResalePlannedAfterDevelopment,
  );

  return (
    <StakeholdersBuildingsDeveloper
      initialValues={initialValues}
      onBack={onBack}
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
          answers:
            formData.developerWillBeBuildingsConstructor === "yes"
              ? {
                  developerWillBeBuildingsConstructor: true,
                  buildingsResalePlannedAfterDevelopment: formData.buildingsResalePlanned === "yes",
                }
              : { developerWillBeBuildingsConstructor: false },
        });
      }}
    />
  );
}
