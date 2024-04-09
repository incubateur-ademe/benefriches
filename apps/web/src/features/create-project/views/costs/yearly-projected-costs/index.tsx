import {
  completeYearlyProjectedCosts,
  revertYearlyProjectedCosts,
} from "../../../application/createProject.reducer";
import YearlyProjectedsCostsForm, { FormValues } from "./YearlyProjectedCostsForm";

import { AppDispatch } from "@/app/application/store";
import {
  computeDefaultPhotovoltaicYearlyMaintenanceAmount,
  computeDefaultPhotovoltaicYearlyRentAmount,
  computeDefaultPhotovoltaicYearlyTaxesAmount,
} from "@/features/create-project/domain/defaultValues";
import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const costsFormMap = {
  rentAmount: "rent",
  maintenanceAmount: "maintenance",
  taxesAmount: "taxes",
  otherAmount: "other",
} as const;

const mapProps = (dispatch: AppDispatch, electricalPowerKWc?: number) => {
  return {
    defaultValues: electricalPowerKWc
      ? {
          rent: computeDefaultPhotovoltaicYearlyRentAmount(electricalPowerKWc),
          maintenance: computeDefaultPhotovoltaicYearlyMaintenanceAmount(electricalPowerKWc),
          taxes: computeDefaultPhotovoltaicYearlyTaxesAmount(electricalPowerKWc),
        }
      : undefined,
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
  const electricalPowerKWc = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaicInstallationElectricalPowerKWc,
  );

  return <YearlyProjectedsCostsForm {...mapProps(dispatch, electricalPowerKWc)} />;
}

export default YearlyProjectedCostsFormContainer;
