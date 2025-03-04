import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { siteNatureReverted } from "../../core/actions/createSite.actions";
import { siteNatureCompleted } from "../../core/createSite.reducer";
import SiteNatureForm, { FormValues } from "./SiteNatureForm";

function SiteNatureFormContainer() {
  const dispatch = useAppDispatch();
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);

  return (
    <SiteNatureForm
      initialValues={siteNature ? { nature: siteNature } : undefined}
      onSubmit={(data: FormValues) => {
        dispatch(siteNatureCompleted({ nature: data.nature }));
      }}
      onBack={() => {
        dispatch(siteNatureReverted());
      }}
    />
  );
}

export default SiteNatureFormContainer;
