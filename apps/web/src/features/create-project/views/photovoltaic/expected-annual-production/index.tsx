import PhotovoltaicExpectedAnnualProductionForm from "./ExpectedAnnualProductionForm";

import {
  goToStep,
  ProjectCreationStep,
  setPhotovoltaicExpectedAnnualProduction,
} from "@/features/create-project/application/createProject.reducer";
import { AVERAGE_PHOTOVOLTAIC_ANNUAL_PRODUCTION_IN_KWH_BY_KWC_IN_FRANCE } from "@/features/create-project/domain/photovoltaic";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

const computeAveragePhotovoltaicAnnualProductionInMegaWattPerYear = (
  electricalPower: number,
) =>
  Math.round(
    (AVERAGE_PHOTOVOLTAIC_ANNUAL_PRODUCTION_IN_KWH_BY_KWC_IN_FRANCE *
      electricalPower) /
      1000,
  );

function PhotovoltaicExpectedAnnualProductionContainer() {
  const dispatch = useAppDispatch();
  const electricalPowerKWc = useAppSelector(
    (state) =>
      state.projectCreation.projectData
        .photovoltaicInstallationElectricalPowerKWc ?? 0,
  );

  return (
    <PhotovoltaicExpectedAnnualProductionForm
      suggestedAnnualProductionInMegaWattPerYear={computeAveragePhotovoltaicAnnualProductionInMegaWattPerYear(
        electricalPowerKWc,
      )}
      onSubmit={(data) => {
        dispatch(
          setPhotovoltaicExpectedAnnualProduction(
            data.photovoltaicExpectedAnnualProduction,
          ),
        );
        dispatch(goToStep(ProjectCreationStep.PHOTOVOLTAIC_CONTRACT_DURATION));
      }}
    />
  );
}

export default PhotovoltaicExpectedAnnualProductionContainer;
