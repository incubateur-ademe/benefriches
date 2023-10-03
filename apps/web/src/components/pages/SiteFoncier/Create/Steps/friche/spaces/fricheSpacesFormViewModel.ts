import { FricheSpaceType } from "@/components/pages/SiteFoncier/friche";
import { setSpacesTypes } from "@/store/features/friche-creation/fricheCreation";
import { AppDispatch } from "@/store/store";

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
