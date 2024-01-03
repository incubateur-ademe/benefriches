import SiteYearlyExpensesForm, { FormValues } from "./SiteYearlyExpensesForm";

import {
  addExpenses,
  goToStep,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { hasTenant } from "@/features/create-site/domain/site.functions";
import { Expense, SiteDraft } from "@/features/create-site/domain/siteFoncier.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { AppDispatch, RootState } from "@/store";

const mapProps = (dispatch: AppDispatch, { siteData }: RootState["siteCreation"]) => {
  return {
    hasTenant: hasTenant(siteData as SiteDraft),
    onSubmit: (formData: FormValues) => {
      const expenses: Expense[] = [];

      if (formData.rent) {
        expenses.push({
          type: "rent",
          category: "rent",
          amount: formData.rent,
          bearer: "tenant",
        });
      }
      if (formData.propertyTaxes) {
        expenses.push({
          type: "propertyTaxes",
          category: "taxes",
          amount: formData.propertyTaxes,
          bearer: "owner",
        });
      }
      if (formData.otherTaxes) {
        expenses.push({
          type: "otherTaxes",
          category: "taxes",
          amount: formData.otherTaxes,
          bearer: "tenant",
        });
      }
      if (formData.otherExpense) {
        expenses.push({
          type: "other",
          category: "other",
          amount: formData.otherExpense,
          bearer: "tenant",
        });
      }

      dispatch(addExpenses(expenses));

      const nextStep = siteData.isFriche
        ? SiteCreationStep.EXPENSES_SUMMARY
        : SiteCreationStep.YEARLY_INCOME;
      dispatch(goToStep(nextStep));
    },
  };
};

function SiteYearlyExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const siteCreationState = useAppSelector((state) => state.siteCreation);

  return <SiteYearlyExpensesForm {...mapProps(dispatch, siteCreationState)} />;
}

export default SiteYearlyExpensesFormContainer;
