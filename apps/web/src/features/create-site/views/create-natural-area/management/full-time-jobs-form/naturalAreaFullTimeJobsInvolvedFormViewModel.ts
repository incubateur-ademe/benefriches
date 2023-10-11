import { setFullTimeJobsInvolved } from "@/features/create-site/application/createNaturalArea.reducer";
import { AppDispatch } from "@/store";

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
