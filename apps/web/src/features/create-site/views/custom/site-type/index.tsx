import { revertSiteTypeStep } from "@/features/create-site/application/createSite.actions";
import { siteNatureStepCompleted } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import SiteTypeForm from "./SiteTypeForm";

function SiteTypeFormContainer() {
  const dispatch = useAppDispatch();
  return (
    <SiteTypeForm
      onSubmit={(data) => {
        dispatch(siteNatureStepCompleted({ isFriche: data.isFriche === "yes" }));
      }}
      onBack={() => dispatch(revertSiteTypeStep())}
    />
  );
}

export default SiteTypeFormContainer;
