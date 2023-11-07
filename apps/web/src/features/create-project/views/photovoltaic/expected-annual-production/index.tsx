import PhotovoltaicExpectedAnnualProductionForm from "./ExpectedAnnualProductionForm";

import {
  goToStep,
  ProjectCreationStep,
  setPhotovoltaicExpectedAnnualProduction,
} from "@/features/create-project/application/createProject.reducer";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

function PhotovoltaicExpectedAnnualProductionContainer() {
  const dispatch = useAppDispatch();
  const photovoltaicPower = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaic.power,
  );

  // TODO: Get real accurate value from localisation
  // https://www.hellowatt.fr/panneaux-solaires-photovoltaiques/production-panneaux-solaires
  // https://re.jrc.ec.europa.eu/pvg_tools/fr/tools.html
  // https://www.monkitsolaire.fr/blog/kwh-et-kwc-comprendre-les-unites-de-mesure-en-autoconsommation-n400
  const suggestedAnnualProduction = Math.round(
    (1100 * photovoltaicPower) / 1000,
  );

  return (
    <PhotovoltaicExpectedAnnualProductionForm
      suggestedAnnualProduction={suggestedAnnualProduction}
      onSubmit={(data) => {
        dispatch(
          setPhotovoltaicExpectedAnnualProduction(
            data.photovoltaic.expectedAnnualProduction,
          ),
        );
        dispatch(goToStep(ProjectCreationStep.PHOTOVOLTAIC_CONTRACT_DURATION));
      }}
    />
  );
}

export default PhotovoltaicExpectedAnnualProductionContainer;
