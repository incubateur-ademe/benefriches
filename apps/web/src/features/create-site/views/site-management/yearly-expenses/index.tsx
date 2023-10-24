import SiteYearlyExpensesForm, { FormValues } from "./SiteYearlyExpensesForm";

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
      const expenses: Expense[] = formData.otherExpenses.map(({ amount }) => {
        return { amount, bearer: "owner", type: "other" };
      });

      if (formData.rent) {
        expenses.push({
          type: "rent",
          amount: formData.rent,
          bearer: "tenant",
        });
      }
      if (formData.propertyTaxes) {
        expenses.push({
          type: "propertyTaxes",
          amount: formData.propertyTaxes,
          bearer: "owner",
        });
      }
      if (formData.otherTaxes) {
        expenses.push({
          type: "otherTaxes",
          amount: formData.otherTaxes,
          bearer: "tenant",
        });
      }

      dispatch(addExpenses(expenses));
      dispatch(goToStep(SiteCreationStep.NAMING));
    },
  };
};

function SiteYearlyExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const siteCreationState = useAppSelector((state) => state.siteCreation);

  return <SiteYearlyExpensesForm {...mapProps(dispatch, siteCreationState)} />;
}

export default SiteYearlyExpensesFormContainer;
