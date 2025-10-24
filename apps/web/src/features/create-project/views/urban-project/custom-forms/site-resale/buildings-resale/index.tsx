import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import BuildingsResaleForm from "./BuildingsResaleForm";

export default function BuildingsResaleFormContainer() {
  const { onBack, selectStepAnswers, onRequestStepCompletion } = useProjectForm();

  const buildingsResalePlannedAfterDevelopment = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION"),
  )?.buildingsResalePlannedAfterDevelopment;

  return (
    <BuildingsResaleForm
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
          answers: {
            buildingsResalePlannedAfterDevelopment: formData.buildingsResalePlanned === "yes",
          },
        });
      }}
      onBack={onBack}
      initialValues={
        buildingsResalePlannedAfterDevelopment === undefined
          ? undefined
          : { buildingsResalePlanned: buildingsResalePlannedAfterDevelopment ? "yes" : "no" }
      }
    />
  );
}
