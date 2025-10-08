import { requestStepCompletion } from "@/features/create-project/core/urban-project-beta/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project-beta/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../useStepBack";
import BuildingsResaleForm from "./BuildingsResaleForm";

export default function BuildingsResaleFormContainer() {
  const dispatch = useAppDispatch();
  const { buildingsResalePlannedAfterDevelopment } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION")) ?? {};
  const onBack = useStepBack();

  return (
    <BuildingsResaleForm
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
            answers: {
              buildingsResalePlannedAfterDevelopment: formData.buildingsResalePlanned === "yes",
            },
          }),
        );
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
