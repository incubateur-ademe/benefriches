import { completeNaming } from "@/features/create-site/core/createSite.reducer";
import { SiteDraft } from "@/features/create-site/core/siteFoncier.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { revertNamingStep } from "../../../core/actions/createSite.actions";
import { generateSiteName } from "../../../core/siteName";
import SiteNameAndDescriptionForm, { FormValues } from "./SiteNameAndDescription";

function SiteNameAndDescriptionFormContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector((state) => state.siteCreation.siteData);

  return (
    <SiteNameAndDescriptionForm
      initialValues={{
        name: siteData.name ?? generateSiteName(siteData as SiteDraft),
        description: siteData.description ?? "",
      }}
      onSubmit={(formData: FormValues) => {
        dispatch(completeNaming(formData));
      }}
      onBack={() => {
        dispatch(revertNamingStep());
      }}
    />
  );
}

export default SiteNameAndDescriptionFormContainer;
