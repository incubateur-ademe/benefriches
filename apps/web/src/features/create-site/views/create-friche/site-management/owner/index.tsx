import FricheOwnerForm, { FormValues } from "./FricheOwnerForm";

import { setOwner } from "@/features/create-site/application/createFriche.reducer";
import { OwnerType } from "@/features/create-site/domain/friche.types";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: FormValues) => {
      switch (data.ownerType) {
        case "LOCAL_OR_REGIONAL_AUTHORITY":
          dispatch(setOwner({ type: data.localAndRegionalAuthorityType! }));
          break;
        case "USER_COMPANY":
        case "OTHER_COMPANY":
          dispatch(setOwner({ type: OwnerType.COMPANY, name: data.ownerName }));
          break;
        case "PRIVATE_INDIVIDUAL":
          dispatch(
            setOwner({
              type: OwnerType.PRIVATE_INDIVIDUAL,
              name: data.ownerName,
            }),
          );
          break;
      }
    },
  };
};

function FricheOwnerFormContainer() {
  const dispatch = useAppDispatch();

  return <FricheOwnerForm {...mapProps(dispatch)} />;
}

export default FricheOwnerFormContainer;
