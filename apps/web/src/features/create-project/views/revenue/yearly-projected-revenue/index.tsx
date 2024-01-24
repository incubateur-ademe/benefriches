import {
  addYearlyProjectedRevenue,
  goToStep,
  ProjectCreationStep,
} from "../../../application/createProject.reducer";
import YearlyProjectedsRevenueForm, { FormValues } from "./ProjectYearlyProjectedRevenueForm";

import { AppDispatch } from "@/app/application/store";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (revenue: FormValues) => {
      const yearlyProjectedRevenue = Object.values(revenue)
        .filter((amount) => !!amount)
        .map((amount) => ({ amount }));
      dispatch(addYearlyProjectedRevenue(yearlyProjectedRevenue));
      dispatch(goToStep(ProjectCreationStep.REVENUE_FINANCIAL_ASSISTANCE));
    },
  };
};

function YearlyProjectedRevenueFormContainer() {
  const dispatch = useAppDispatch();

  return <YearlyProjectedsRevenueForm {...mapProps(dispatch)} />;
}

export default YearlyProjectedRevenueFormContainer;
