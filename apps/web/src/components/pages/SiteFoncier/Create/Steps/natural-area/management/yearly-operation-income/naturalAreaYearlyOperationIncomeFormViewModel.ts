import { setYearlyOperationIncome } from "@/store/features/naturalAreaCreation";
import { AppDispatch } from "@/store/store";

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
