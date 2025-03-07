import { naturalAreaTypeReverted } from "@/features/create-site/core/actions/createSite.actions";
import { naturalAreaTypeCompleted } from "@/features/create-site/core/createSite.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

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
        dispatch(naturalAreaTypeReverted());
      }}
    />
  );
}
