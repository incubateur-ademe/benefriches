import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectManagerViewData } from "@/features/create-site/core/urban-zone/steps/management/manager/manager.selectors";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

import ManagerForm from "./ManagerForm";

function ManagerContainer() {
  const dispatch = useAppDispatch();
  const { initialValues } = useAppSelector(selectManagerViewData);

  return (
    <ManagerForm
      initialValues={initialValues}
      onSubmit={({ structureType }) => {
        dispatch(
          stepCompletionRequested({
            stepId: "URBAN_ZONE_MANAGER",
            answers: { structureType },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default ManagerContainer;
