import { setFullTimeJobsInvolved } from "@/store/features/naturalAreaCreation";
import { AppDispatch } from "@/store/store";

type FormData = {
  fullTimeJobsInvolved: number;
};

export const buildViewModel = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: FormData) => {
      dispatch(setFullTimeJobsInvolved(formData.fullTimeJobsInvolved));
    },
  };
};
