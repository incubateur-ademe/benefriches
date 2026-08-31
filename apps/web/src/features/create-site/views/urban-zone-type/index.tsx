import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/custom/custom.actions";
import { selectUrbanZoneTypeViewData } from "@/features/create-site/core/steps/urban-zone/urbanZoneType.selectors";

import UrbanZoneTypeForm, { FormValues } from "./UrbanZoneTypeForm";

function UrbanZoneTypeFormContainer() {
  const dispatch = useAppDispatch();
  const { urbanZoneType } = useAppSelector(selectUrbanZoneTypeViewData);

  return (
    <UrbanZoneTypeForm
      initialValues={urbanZoneType ? { urbanZoneType } : undefined}
      onSubmit={(data: FormValues) => {
        dispatch(
          stepCompletionRequested({
            stepId: "URBAN_ZONE_TYPE",
            answers: { urbanZoneType: data.urbanZoneType },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default UrbanZoneTypeFormContainer;
