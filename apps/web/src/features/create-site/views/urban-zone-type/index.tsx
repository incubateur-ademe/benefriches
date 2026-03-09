import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { urbanZoneTypeCompleted } from "@/features/create-site/core/steps/urban-zone/urbanZone.actions";
import { selectUrbanZoneTypeViewData } from "@/features/create-site/core/steps/urban-zone/urbanZoneType.selectors";

import UrbanZoneTypeForm, { FormValues } from "./UrbanZoneTypeForm";

function UrbanZoneTypeFormContainer() {
  const dispatch = useAppDispatch();
  const { urbanZoneType } = useAppSelector(selectUrbanZoneTypeViewData);

  return (
    <UrbanZoneTypeForm
      initialValues={urbanZoneType ? { urbanZoneType } : undefined}
      onSubmit={(data: FormValues) => {
        dispatch(urbanZoneTypeCompleted({ urbanZoneType: data.urbanZoneType }));
      }}
      onBack={() => {
        dispatch(stepReverted());
      }}
    />
  );
}

export default UrbanZoneTypeFormContainer;
