import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { siteNatureCompleted } from "../../core/actions/introduction.actions";
import { stepRevertAttempted } from "../../core/actions/revert.actions";
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
        dispatch(stepRevertAttempted());
      }}
    />
  );
}

export default SiteNatureFormContainer;
