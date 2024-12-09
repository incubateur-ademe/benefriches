import { completeNaming } from "@/features/create-site/application/createSite.reducer";
import { SiteDraft } from "@/features/create-site/domain/siteFoncier.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { revertNamingStep } from "../../../application/createSite.actions";
import { generateSiteName } from "../../../domain/siteName";
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
