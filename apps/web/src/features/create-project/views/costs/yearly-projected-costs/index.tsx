import {
  addYearlyProjectedCosts,
  goToStep,
  ProjectCreationStep,
} from "../../../application/createProject.reducer";
import YearlyProjectedsCostsForm, { FormValues } from "./YearlyProjectedCostsForm";

import { AppDispatch } from "@/app/application/store";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (amounts: FormValues) => {
      const yearlyProjectedCosts = Object.values(amounts)
        .filter((amount) => !!amount)
        .map((amount) => ({ amount }));
      dispatch(addYearlyProjectedCosts(yearlyProjectedCosts));
      dispatch(goToStep(ProjectCreationStep.REVENUE_INTRODUCTION));
    },
  };
};

function YearlyProjectedCostsFormContainer() {
  const dispatch = useAppDispatch();

  return <YearlyProjectedsCostsForm {...mapProps(dispatch)} />;
}

export default YearlyProjectedCostsFormContainer;
