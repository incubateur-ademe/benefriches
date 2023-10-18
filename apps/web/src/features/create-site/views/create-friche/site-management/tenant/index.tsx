import FricheTenantForm, { FormValues } from "./FricheTenantForm";

import {
  goToNextStep,
  setTenant,
} from "@/features/create-site/application/createFriche.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: FormValues) => {
      if (data.tenantBusinessName) {
        dispatch(setTenant(data.tenantBusinessName));
      } else {
        dispatch(goToNextStep());
      }
    },
  };
};

function FricheTenantFormContainer() {
  const dispatch = useAppDispatch();

  return <FricheTenantForm {...mapProps(dispatch)} />;
}

export default FricheTenantFormContainer;
