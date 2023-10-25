import SoilsDegradationYearlyExpensesForm, {
  FormValues,
} from "./SoilsDegradationYearlyExpensesForm";

import {
  addExpenses,
  goToStep,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import {
  hasBuildings,
  hasContaminatedSoils,
  hasImpermeableSoils,
} from "@/features/create-site/domain/site.functions";
import {
  Expense,
  SiteFoncier,
} from "@/features/create-site/domain/siteFoncier.types";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";
import { AppDispatch, RootState } from "@/store";

const mapProps = (
  dispatch: AppDispatch,
  siteCreationState: RootState["siteCreation"],
) => {
  return {
    askForWaterTreatmentExpenses: hasContaminatedSoils(
      siteCreationState.siteData as SiteFoncier,
    ),
    askForFloodsRegulationExpenses:
      hasImpermeableSoils(siteCreationState.siteData as SiteFoncier) ||
      hasBuildings(siteCreationState.siteData as SiteFoncier),
    onSubmit: (formData: FormValues) => {
      const expenses: Expense[] = [];

      if (formData.floodsRegulationYearlyExpenses)
        expenses.push({
          type: "floodsRegulation",
          amount: formData.floodsRegulationYearlyExpenses,
          bearer: "local_or_regional_authority",
        });
      if (formData.waterTreatmentYearlyExpenses)
        expenses.push({
          type: "waterTreatment",
          amount: formData.waterTreatmentYearlyExpenses,
          bearer: "society",
        });

      dispatch(addExpenses(expenses));
      dispatch(goToStep(SiteCreationStep.EXPENSES_SUMMARY));
    },
  };
};

function SoilsDegradationYearlyExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const siteCreationState = useAppSelector((state) => state.siteCreation);

  return (
    <SoilsDegradationYearlyExpensesForm
      {...mapProps(dispatch, siteCreationState)}
    />
  );
}

export default SoilsDegradationYearlyExpensesFormContainer;
