import { FricheLastActivity } from "@/components/pages/SiteFoncier/friche";
import { setLastActivity } from "@/store/features/fricheCreation";
import { AppDispatch } from "@/store/store";

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
