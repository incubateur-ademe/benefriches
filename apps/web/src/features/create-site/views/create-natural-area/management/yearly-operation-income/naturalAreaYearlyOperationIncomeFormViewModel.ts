import { setYearlyOperationIncome } from "@/features/create-site/application/createNaturalArea.reducer";
import { AppDispatch } from "@/store";

type FormData = {
  operationsIncome?: number;
  otherIncome?: number;
};

export const buildViewModel = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: FormData) => {
      const income = {
        operations: formData.operationsIncome ?? 0,
        other: formData.otherIncome ?? 0,
      };
      dispatch(setYearlyOperationIncome(income));
    },
  };
};
