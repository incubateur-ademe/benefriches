import FricheSecuringCostsForm, { FormValues } from "./FricheSecuringCostsForm";

import {
  addExpenses,
  goToStep,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { hasTenant } from "@/features/create-site/domain/site.functions";
import {
  Expense,
  SiteDraft,
} from "@/features/create-site/domain/siteFoncier.types";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";
import { AppDispatch, RootState } from "@/store";

type SafetyExpenseProps = {
  type: string;
  amount: number;
  bearer?: Expense["bearer"];
};
const buildSafetyExpense = ({
  type,
  amount,
  bearer = "owner",
}: SafetyExpenseProps): Expense => {
  return {
    category: "safety",
    type,
    amount,
    bearer,
  };
};

const mapProps = (
  dispatch: AppDispatch,
  siteCreationState: RootState["siteCreation"],
) => {
  return {
    hasTenant: hasTenant(siteCreationState.siteData as SiteDraft),
    onSubmit: (formData: FormValues) => {
      const expenses: Expense[] = [];

      if (formData.securityExpenses)
        expenses.push(
          buildSafetyExpense({
            type: "security",
            amount: formData.securityExpenses,
            bearer: formData.securityExpensesBearer,
          }),
        );

      if (formData.accidentsExpenses)
        expenses.push(
          buildSafetyExpense({
            type: "accidents",
            amount: formData.accidentsExpenses,
          }),
        );
      if (formData.illegalDumpingExpenses)
        expenses.push(
          buildSafetyExpense({
            type: "illegalDumping",
            amount: formData.illegalDumpingExpenses,
            bearer: formData.illegalDumpingExpensesBearer,
          }),
        );
      if (formData.maintenanceExpenses)
        expenses.push(
          buildSafetyExpense({
            type: "maintenance",
            amount: formData.maintenanceExpenses,
          }),
        );
      if (formData.otherExpenses)
        expenses.push(
          buildSafetyExpense({
            type: "other",
            amount: formData.otherExpenses,
            bearer: formData.otherExpensesBearer,
          }),
        );

      dispatch(addExpenses(expenses));
      dispatch(goToStep(SiteCreationStep.YEARLY_EXPENSES));
    },
  };
};

function FricheSecuringCostsFormContainer() {
  const dispatch = useAppDispatch();
  const siteCreationState = useAppSelector((state) => state.siteCreation);

  return <FricheSecuringCostsForm {...mapProps(dispatch, siteCreationState)} />;
}

export default FricheSecuringCostsFormContainer;
