import { setYearlyOperationExpenses } from "@/features/create-site/application/createNaturalArea.reducer";
import {
  NaturalArea,
  OperationStatus,
} from "@/features/create-site/domain/naturalArea.types";
import { AppDispatch } from "@/store";

type FormData = {
  rent?: number;
  taxes?: number;
  otherExpenses?: number;
};

export const buildViewModel = (
  dispatch: AppDispatch,
  naturalAreaData: Partial<NaturalArea>,
) => {
  const askForRent =
    naturalAreaData.operationStatus !== OperationStatus.OPERATED_BY_OWNER;

  return {
    askForRent,
    onSubmit: (formData: FormData) => {
      const expenses = {
        rent: formData.rent ?? 0,
        taxes: formData.taxes ?? 0,
        otherExpenses: formData.otherExpenses ?? 0,
      };
      dispatch(setYearlyOperationExpenses(expenses));
    },
  };
};
