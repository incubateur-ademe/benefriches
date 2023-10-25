import FricheSecuringCostsForm, { FormValues } from "./FricheSecuringCostsForm";

import {
  addExpenses,
  goToStep,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { hasTenant } from "@/features/create-site/domain/site.functions";
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
    hasTenant: hasTenant(siteCreationState.siteData as SiteFoncier),
    onSubmit: (formData: FormValues) => {
      const expenses: Expense[] = [];

      if (formData.securityExpenses)
        expenses.push({
          type: "security",
          amount: formData.securityExpenses,
          bearer: formData.securityExpensesBearer ?? "owner",
        });
      if (formData.accidentsExpenses)
        expenses.push({
          type: "accidents",
          amount: formData.accidentsExpenses,
          bearer: "owner",
        });
      if (formData.illegalDumpingExpenses)
        expenses.push({
          type: "illegalDumping",
          amount: formData.illegalDumpingExpenses,
          bearer: formData.illegalDumpingExpensesBearer ?? "owner",
        });
      if (formData.maintenanceExpenses)
        expenses.push({
          type: "maintenance",
          amount: formData.maintenanceExpenses,
          bearer: "owner",
        });
      if (formData.otherExpenses)
        expenses.push({
          type: "other",
          amount: formData.otherExpenses,
          bearer: formData.otherExpensesBearer ?? "owner",
        });

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