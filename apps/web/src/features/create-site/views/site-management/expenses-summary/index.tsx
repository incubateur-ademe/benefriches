import { getLabelForExpenseBearer } from "./expenseBearerLabelMapping";
import { getLabelForExpenseCategory } from "./expenseCategoryLabelMapping";
import SiteExpensesSummary from "./SiteExpensesSummary";

import {
  goToStep,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import {
  groupExpensesByBearer,
  groupExpensesByCategory,
} from "@/features/create-site/domain/expenses.functions";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";
import { AppDispatch, RootState } from "@/store";

const mapProps = (
  dispatch: AppDispatch,
  siteData: RootState["siteCreation"]["siteData"],
) => {
  return {
    expensesByBearer: groupExpensesByBearer(siteData.yearlyExpenses!).map(
      ({ amount, bearer }) => {
        return {
          bearer: getLabelForExpenseBearer(bearer, {
            ownerName: siteData.owner?.name,
            tenantName: siteData.tenant?.name,
          }),
          amount,
        };
      },
    ),
    expensesByCategory: groupExpensesByCategory(siteData.yearlyExpenses!).map(
      ({ amount, category }) => ({
        amount,
        category: getLabelForExpenseCategory(category),
      }),
    ),
    onNext: () => {
      const nextStep = siteData.isFriche
        ? SiteCreationStep.FRICHE_ACTIVITY
        : SiteCreationStep.NAMING;
      dispatch(goToStep(nextStep));
    },
  };
};

function SiteExpensesSummaryContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector((state) => state.siteCreation.siteData);

  return <SiteExpensesSummary {...mapProps(dispatch, siteData)} />;
}

export default SiteExpensesSummaryContainer;
