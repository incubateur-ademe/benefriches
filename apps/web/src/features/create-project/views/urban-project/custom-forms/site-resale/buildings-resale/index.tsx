import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { buildingsResaleChoiceCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectCreationData } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import BuildingsResaleForm from "./BuildingsResaleForm";

export default function BuildingsResaleFormContainer() {
  const dispatch = useAppDispatch();
  const initialValue = useAppSelector(selectCreationData).buildingsResalePlannedAfterDevelopment;
  const hasInitialValue = initialValue !== undefined;

  return (
    <BuildingsResaleForm
      initialValues={
        hasInitialValue
          ? {
              buildingsResalePlanned: initialValue ? "yes" : "no",
            }
          : undefined
      }
      onSubmit={(formData) => {
        dispatch(
          buildingsResaleChoiceCompleted({
            buildingsResalePlannedAfterDevelopment: formData.buildingsResalePlanned === "yes",
          }),
        );
      }}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
    />
  );
}
