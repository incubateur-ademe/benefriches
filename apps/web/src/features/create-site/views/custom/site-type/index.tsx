import SiteTypeForm from "./SiteTypeForm";

import { revertSiteTypeStep } from "@/features/create-site/application/createSite.actions";
import { completeSiteTypeStep } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function SiteTypeFormContainer() {
  const dispatch = useAppDispatch();
  return (
    <SiteTypeForm
      onSubmit={(data) => {
        dispatch(completeSiteTypeStep({ isFriche: data.isFriche === "yes" }));
      }}
      onBack={() => dispatch(revertSiteTypeStep())}
    />
  );
}

export default SiteTypeFormContainer;
