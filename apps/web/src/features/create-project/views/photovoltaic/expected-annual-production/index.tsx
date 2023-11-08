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

// Production annuelle en kWh/kWc en France
// https://www.hellowatt.fr/panneaux-solaires-photovoltaiques/production-panneaux-solaires
// TODO: Get real accurate value from localisation
// https://re.jrc.ec.europa.eu/pvg_tools/fr/tools.html
// https://www.monkitsolaire.fr/blog/kwh-et-kwc-comprendre-les-unites-de-mesure-en-autoconsommation-n400
const AVERAGE_ANNUAL_PRODUCTION_IN_KWH_BY_KWC_IN_FRANCE = 1100;

function PhotovoltaicExpectedAnnualProductionContainer() {
  const dispatch = useAppDispatch();
  const photovoltaicPower = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaic.power,
  );

  const suggestedAnnualProductionMWhPerYear = Math.round(
    (AVERAGE_ANNUAL_PRODUCTION_IN_KWH_BY_KWC_IN_FRANCE * photovoltaicPower) /
      1000,
  );

  return (
    <PhotovoltaicExpectedAnnualProductionForm
      suggestedAnnualProduction={suggestedAnnualProductionMWhPerYear}
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
