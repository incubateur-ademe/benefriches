import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { naturalAreaTypeCompleted } from "@/features/create-site/core/steps/site-activity/siteActivity.actions";

import NaturalAreaTypeForm, { FormValues } from "./NaturalAreaTypeForm";

export default function NaturalAreaTypeFormContainer() {
  const dispatch = useAppDispatch();
  const naturalAreaType = useAppSelector((state) => state.siteCreation.siteData.naturalAreaType);

  return (
    <NaturalAreaTypeForm
      initialValues={naturalAreaType ? { type: naturalAreaType } : undefined}
      onSubmit={(data: FormValues) => {
        dispatch(naturalAreaTypeCompleted({ naturalAreaType: data.type }));
      }}
      onBack={() => {
        dispatch(stepReverted());
      }}
    />
  );
}
