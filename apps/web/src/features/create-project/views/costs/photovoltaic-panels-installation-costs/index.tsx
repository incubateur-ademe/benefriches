import {
  completePhotovoltaicPanelsInstallationCost,
  revertPhotovoltaicPanelsInstallationCost,
} from "../../../application/createProject.reducer";
import PhotovoltaicPanelsInstallationCostsForm, {
  FormValues,
} from "./PhotoVoltaicPanelsInstallationCostsForm";

import { AppDispatch } from "@/app/application/store";
import {
  computeDefaultPhotovoltaicOtherAmountCost,
  computeDefaultPhotovoltaicTechnicalStudiesAmountCost,
  computeDefaultPhotovoltaicWorksAmountCost,
} from "@/features/create-project/domain/defaultValues";
import { sumObjectValues } from "@/shared/services/sum/sum";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch, electricalPowerKWc?: number) => {
  return {
    defaultValues: electricalPowerKWc
      ? {
          works: computeDefaultPhotovoltaicWorksAmountCost(electricalPowerKWc),
          technicalStudy: computeDefaultPhotovoltaicTechnicalStudiesAmountCost(electricalPowerKWc),
          other: computeDefaultPhotovoltaicOtherAmountCost(electricalPowerKWc),
        }
      : undefined,
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
  const electricalPowerKWc = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaicInstallationElectricalPowerKWc,
  );

  return <PhotovoltaicPanelsInstallationCostsForm {...mapProps(dispatch, electricalPowerKWc)} />;
}

export default PhotovoltaicPanelsInstallationCostsFormContainer;
