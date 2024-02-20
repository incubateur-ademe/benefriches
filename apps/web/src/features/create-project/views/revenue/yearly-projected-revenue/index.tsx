import {
  addYearlyProjectedRevenue,
  goToStep,
  ProjectCreationStep,
} from "../../../application/createProject.reducer";
import YearlyProjectedsRevenueForm, { FormValues } from "./ProjectYearlyProjectedRevenueForm";

import { AppDispatch } from "@/app/application/store";
import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const revenuesFormMap = {
  operationsAmount: "operations",
  otherAmount: "other",
} as const;

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (revenues: FormValues) => {
      const yearlyProjectedRevenues = typedObjectKeys(revenues)
        .filter((sourceKey) => !!revenues[sourceKey])
        .map((sourceKey) => ({
          source: revenuesFormMap[sourceKey],
          amount: revenues[sourceKey] as number,
        }));

      dispatch(addYearlyProjectedRevenue(yearlyProjectedRevenues));
      dispatch(goToStep(ProjectCreationStep.REVENUE_FINANCIAL_ASSISTANCE));
    },
  };
};

function YearlyProjectedRevenueFormContainer() {
  const dispatch = useAppDispatch();

  return <YearlyProjectedsRevenueForm {...mapProps(dispatch)} />;
}

export default YearlyProjectedRevenueFormContainer;
