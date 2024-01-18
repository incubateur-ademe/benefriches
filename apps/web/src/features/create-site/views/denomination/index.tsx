import { saveSiteAction } from "../../application/createSite.actions";
import { SiteDraft } from "../../domain/siteFoncier.types";
import { generateSiteName } from "../../domain/siteName";
import SiteNameAndDescriptionForm, { FormValues } from "./SiteNameAndDescription";

import {
  goToStep,
  setNameAndDescription,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch, siteData: SiteDraft) => {
  return {
    defaultSiteName: generateSiteName(siteData),
    onSubmit: (formData: FormValues) => {
      dispatch(setNameAndDescription(formData));
      void dispatch(saveSiteAction());
      dispatch(goToStep(SiteCreationStep.CREATION_CONFIRMATION));
    },
  };
};

function SiteNameAndDescriptionFormContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector((state) => state.siteCreation.siteData);

  return <SiteNameAndDescriptionForm {...mapProps(dispatch, siteData as SiteDraft)} />;
}

export default SiteNameAndDescriptionFormContainer;
