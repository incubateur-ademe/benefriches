import {
  NaturalArea,
  OperationStatus,
} from "@/components/pages/SiteFoncier/siteFoncier";
import { setYearlyOperationExpenses } from "@/store/features/naturalAreaCreation";
import { AppDispatch } from "@/store/store";

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
