import { setLastActivity } from "@/features/create-site/application/createFriche.reducers";
import { FricheLastActivity } from "@/features/create-site/domain/friche.types";
import { AppDispatch } from "@/store";

type FormData = {
  lastActivity: FricheLastActivity;
};

export const buildViewModel = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: FormData) => {
      dispatch(setLastActivity(formData.lastActivity));
    },
  };
};
