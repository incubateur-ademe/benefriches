import {
  completeYearlyProjectedCosts,
  revertYearlyProjectedCosts,
} from "../../../application/createProject.reducer";
import YearlyProjectedsCostsForm, { FormValues } from "./YearlyProjectedCostsForm";

import { AppDispatch } from "@/app/application/store";
import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const costsFormMap = {
  rentAmount: "rent",
  maintenanceAmount: "maintenance",
  taxesAmount: "taxes",
  otherAmount: "other",
} as const;

const mapProps = (dispatch: AppDispatch) => {
  return {
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

  return <YearlyProjectedsCostsForm {...mapProps(dispatch)} />;
}

export default YearlyProjectedCostsFormContainer;
