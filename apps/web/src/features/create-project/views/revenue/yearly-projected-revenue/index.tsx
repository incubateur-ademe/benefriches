import {
  addYearlyProjectedRevenue,
  goToStep,
  ProjectCreationStep,
} from "../../../application/createProject.reducer";
import YearlyProjectedsRevenueForm, {
  FormValues,
} from "./ProjectYearlyProjectedRevenueForm";

import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (revenue: FormValues) => {
      const yearlyProjectedRevenue = Object.values(revenue)
        .filter((amount) => !!amount)
        .map((amount) => ({ amount }));
      dispatch(addYearlyProjectedRevenue(yearlyProjectedRevenue));
      dispatch(goToStep(ProjectCreationStep.NAMING));
    },
  };
};

function YearlyProjectedRevenueFormContainer() {
  const dispatch = useAppDispatch();

  return <YearlyProjectedsRevenueForm {...mapProps(dispatch)} />;
}

export default YearlyProjectedRevenueFormContainer;
