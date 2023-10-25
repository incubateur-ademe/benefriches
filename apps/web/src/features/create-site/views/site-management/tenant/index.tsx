import FricheTenantForm, { FormValues } from "./SiteTenantForm";

import {
  goToStep,
  setTenant,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: FormValues) => {
      if (data.tenantBusinessName) {
        dispatch(setTenant(data.tenantBusinessName));
      }
      dispatch(goToStep(SiteCreationStep.FULL_TIME_JOBS_INVOLVED));
    },
  };
};

function FricheTenantFormContainer() {
  const dispatch = useAppDispatch();

  return <FricheTenantForm {...mapProps(dispatch)} />;
}

export default FricheTenantFormContainer;