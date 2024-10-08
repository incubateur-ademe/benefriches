import { PhotovoltaicInstallationExpense, typedObjectEntries } from "shared";
import {
  completePhotovoltaicPanelsInstallationExpenses,
  revertPhotovoltaicPanelsInstallationExpenses,
} from "../../../../application/createProject.reducer";
import PhotovoltaicPanelsInstallationExpensesForm, {
  FormValues,
} from "./PhotoVoltaicPanelsInstallationCostsForm";

import { AppDispatch } from "@/app/application/store";
import { getDefaultValuesForPhotovoltaicInstallationExpenses } from "@/features/create-project/application/createProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapFormValuesToPhotovoltaicInstallationExpenses = (
  formData: FormValues,
): PhotovoltaicInstallationExpense[] => {
  const expenses: PhotovoltaicInstallationExpense[] = [];
  typedObjectEntries(formData).forEach(([purpose, amount]) => {
    if (!amount) return;
    switch (purpose) {
      case "technicalStudyAmount":
        expenses.push({ amount: amount, purpose: "technical_studies" });
        break;
      case "worksAmount":
        expenses.push({ amount: amount, purpose: "installation_works" });
        break;
      case "otherAmount":
        expenses.push({ amount: amount, purpose: "other" });
        break;
      default:
        break;
    }
  });
  return expenses;
};

const mapProps = (
  dispatch: AppDispatch,
  defaultValues?: { works: number; technicalStudy: number; other: number },
) => {
  return {
    defaultValues,
    onSubmit: (formData: FormValues) => {
      const expenses = mapFormValuesToPhotovoltaicInstallationExpenses(formData);
      dispatch(completePhotovoltaicPanelsInstallationExpenses(expenses));
    },
    onBack: () => {
      dispatch(revertPhotovoltaicPanelsInstallationExpenses());
    },
  };
};

function PhotovoltaicPanelsInstallationExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const defaultValues = useAppSelector(getDefaultValuesForPhotovoltaicInstallationExpenses);

  return <PhotovoltaicPanelsInstallationExpensesForm {...mapProps(dispatch, defaultValues)} />;
}

export default PhotovoltaicPanelsInstallationExpensesFormContainer;
