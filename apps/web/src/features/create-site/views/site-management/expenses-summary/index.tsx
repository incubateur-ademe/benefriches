import { getLabelForExpenseBearer } from "./expenseBearerLabelMapping";
import { getLabelForExpenseCategory } from "./expenseCategoryLabelMapping";
import SiteExpensesSummary from "./SiteExpensesSummary";

import { AppDispatch, RootState } from "@/app/application/store";
import { goToStep, SiteCreationStep } from "@/features/create-site/application/createSite.reducer";
import {
  groupExpensesByBearer,
  groupExpensesByCategory,
} from "@/features/create-site/domain/expenses.functions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch, siteData: RootState["siteCreation"]["siteData"]) => {
  const onNext = () => {
    const nextStep = siteData.isFriche
      ? SiteCreationStep.FRICHE_ACTIVITY
      : SiteCreationStep.YEARLY_INCOME;
    dispatch(goToStep(nextStep));
  };

  if (!siteData.yearlyExpenses || siteData.yearlyExpenses.length === 0) {
    return {
      hasExpenses: false,
      expensesByBearer: [],
      expensesByCategory: [],
      onNext,
    };
  }
  return {
    hasExpenses: true,
    expensesByBearer: groupExpensesByBearer(siteData.yearlyExpenses).map(({ amount, bearer }) => {
      return {
        bearer: getLabelForExpenseBearer(bearer, {
          ownerName: siteData.owner?.name,
          tenantName: siteData.tenant?.name,
        }),
        amount,
      };
    }),
    expensesByCategory: groupExpensesByCategory(siteData.yearlyExpenses).map(
      ({ amount, category }) => ({
        amount,
        category: getLabelForExpenseCategory(category),
      }),
    ),
    onNext,
  };
};

function SiteExpensesSummaryContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector((state) => state.siteCreation.siteData);

  return <SiteExpensesSummary {...mapProps(dispatch, siteData)} />;
}

export default SiteExpensesSummaryContainer;
