import {
  completePhotovoltaicPanelsInstallationCost,
  revertPhotovoltaicPanelsInstallationCost,
} from "../../../application/createProject.reducer";
import PhotovoltaicPanelsInstallationCostsForm, {
  FormValues,
} from "./PhotoVoltaicPanelsInstallationCostsForm";

import { AppDispatch } from "@/app/application/store";
import { getDefaultValuesForPhotovoltaicInstallationCosts } from "@/features/create-project/application/createProject.selectors";
import { sumObjectValues } from "@/shared/services/sum/sum";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (
  dispatch: AppDispatch,
  defaultValues?: { works: number; technicalStudy: number; other: number },
) => {
  return {
    defaultValues,
    onSubmit: (amounts: FormValues) => {
      const totalCost = sumObjectValues(amounts);
      dispatch(completePhotovoltaicPanelsInstallationCost(totalCost));
    },
    onBack: () => {
      dispatch(revertPhotovoltaicPanelsInstallationCost());
    },
  };
};

function PhotovoltaicPanelsInstallationCostsFormContainer() {
  const dispatch = useAppDispatch();
  const defaultValues = useAppSelector(getDefaultValuesForPhotovoltaicInstallationCosts);

  return <PhotovoltaicPanelsInstallationCostsForm {...mapProps(dispatch, defaultValues)} />;
}

export default PhotovoltaicPanelsInstallationCostsFormContainer;
