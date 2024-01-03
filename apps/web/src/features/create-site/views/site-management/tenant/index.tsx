import FricheTenantForm, { FormValues } from "./SiteTenantForm";

import {
  goToStep,
  setTenant,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { SiteDraft } from "@/features/create-site/domain/siteFoncier.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch, siteData: Partial<SiteDraft>) => {
  return {
    onSubmit: (data: FormValues) => {
      if (data.tenantType === "company") {
        dispatch(
          setTenant({
            structureType: "company",
            name: data.companyName,
          }),
        );
      }
      if (data.tenantType === "local_or_regional_authority") {
        dispatch(
          setTenant({
            structureType: "local_or_regional_authority",
            name: data.localOrRegionalAuthority,
          }),
        );
      }
      const nextStep = siteData.isFriche
        ? SiteCreationStep.RECENT_ACCIDENTS
        : SiteCreationStep.YEARLY_EXPENSES;
      dispatch(goToStep(nextStep));
    },
  };
};

function FricheTenantFormContainer() {
  const dispatch = useAppDispatch();
  const siteDraft = useAppSelector((state) => state.siteCreation.siteData);

  return <FricheTenantForm {...mapProps(dispatch, siteDraft)} />;
}

export default FricheTenantFormContainer;
