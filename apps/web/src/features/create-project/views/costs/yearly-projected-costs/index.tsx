import {
  completeYearlyProjectedCosts,
  revertYearlyProjectedCosts,
} from "../../../application/createProject.reducer";
import YearlyProjectedsCostsForm, { FormValues } from "./YearlyProjectedCostsForm";

import { AppDispatch } from "@/app/application/store";
import { getDefaultValuesForYearlyProjectedCosts } from "@/features/create-project/application/createProject.selectors";
import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const costsFormMap = {
  rentAmount: "rent",
  maintenanceAmount: "maintenance",
  taxesAmount: "taxes",
  otherAmount: "other",
} as const;

const mapProps = (
  dispatch: AppDispatch,
  defaultValues?: { rent: number; maintenance: number; taxes: number },
) => {
  return {
    defaultValues,
    onSubmit: (costs: FormValues) => {
      const yearlyProjectedCosts = typedObjectKeys(costs)
        .filter((sourceKey) => !!costs[sourceKey])
        .map((sourceKey) => ({
          purpose: costsFormMap[sourceKey],
          amount: costs[sourceKey] as number,
        }));
      dispatch(completeYearlyProjectedCosts(yearlyProjectedCosts));
    },
    onBack: () => {
      dispatch(revertYearlyProjectedCosts());
    },
  };
};

function YearlyProjectedCostsFormContainer() {
  const dispatch = useAppDispatch();
  const defaultValues = useAppSelector(getDefaultValuesForYearlyProjectedCosts);

  return <YearlyProjectedsCostsForm {...mapProps(dispatch, defaultValues)} />;
}

export default YearlyProjectedCostsFormContainer;
