import { requestStepCompletion } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../useStepBack";
import BuildingsUseSelection from "./BuildingsUseSelection";

export default function BuildingsUseSelectionContainer() {
  const dispatch = useAppDispatch();

  const { buildingsUsesSelection } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_BUILDINGS_USE_SELECTION")) ?? {};

  const initialValues = buildingsUsesSelection
    ? { buildingsUses: buildingsUsesSelection }
    : undefined;

  const onBack = useStepBack();

  return (
    <BuildingsUseSelection
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_BUILDINGS_USE_SELECTION",
            answers: { buildingsUsesSelection: formData.buildingsUses },
          }),
        );
      }}
      onBack={onBack}
      initialValues={initialValues}
    />
  );
}
