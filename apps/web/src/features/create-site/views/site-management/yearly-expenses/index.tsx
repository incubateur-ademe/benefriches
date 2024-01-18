import { mapFormDataToExpenses } from "./mappers";
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
  const siteHasTenant = hasTenant(siteData as SiteDraft);
  return {
    hasTenant: siteHasTenant,
    isFriche: !!siteData.isFriche,
    hasRecentAccidents: !!siteData.hasRecentAccidents,
    onSubmit: (formData: FormValues) => {
      const expenses: Expense[] = mapFormDataToExpenses(formData, { siteHasTenant });

      dispatch(addExpenses(expenses));

      dispatch(goToStep(SiteCreationStep.EXPENSES_SUMMARY));
    },
  };
};

function SiteYearlyExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const siteCreationState = useAppSelector((state) => state.siteCreation);

  return <SiteYearlyExpensesForm {...mapProps(dispatch, siteCreationState)} />;
}

export default SiteYearlyExpensesFormContainer;
