import { revertNamingStep } from "../../../application/createSite.actions";
import { SiteDraft } from "../../../domain/siteFoncier.types";
import { generateSiteName } from "../../../domain/siteName";
import SiteNameAndDescriptionForm, { FormValues } from "./SiteNameAndDescription";

import { AppDispatch } from "@/app/application/store";
import { completeNaming } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch, siteData: SiteDraft) => {
  return {
    defaultSiteName: generateSiteName(siteData),
    onSubmit: (formData: FormValues) => {
      dispatch(completeNaming(formData));
    },
    onBack: () => {
      dispatch(revertNamingStep());
    },
  };
};

function SiteNameAndDescriptionFormContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector((state) => state.siteCreation.siteData);

  return <SiteNameAndDescriptionForm {...mapProps(dispatch, siteData as SiteDraft)} />;
}

export default SiteNameAndDescriptionFormContainer;
