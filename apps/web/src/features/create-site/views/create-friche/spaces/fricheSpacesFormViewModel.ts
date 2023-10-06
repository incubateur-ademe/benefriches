import { setSpacesTypes } from "@/features/create-site/application/createFriche.reducers";
import { FricheSpaceType } from "@/features/create-site/domain/friche.types";
import { AppDispatch } from "@/store";

type FormData = {
  spaces: FricheSpaceType[];
};

export const buildViewModel = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: FormData) => {
      dispatch(setSpacesTypes(formData.spaces));
    },
  };
};
