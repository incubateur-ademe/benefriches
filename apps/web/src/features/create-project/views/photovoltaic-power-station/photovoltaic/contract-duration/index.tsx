import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { completePhotovoltaicContractDuration } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS } from "@/features/create-project/core/renewable-energy/photovoltaic";
import { selectCreationData } from "@/features/create-project/core/renewable-energy/selectors/renewableEnergy.selector";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import PhotovoltaicContractDurationForm from "./ContractDurationForm";

function PhotovoltaicContractDurationContainer() {
  const dispatch = useAppDispatch();
  const { photovoltaicContractDuration: initialValue } = useAppSelector(selectCreationData);
  return (
    <PhotovoltaicContractDurationForm
      initialValues={{
        photovoltaicContractDuration:
          initialValue ?? AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS,
      }}
      onSubmit={(data) => {
        dispatch(completePhotovoltaicContractDuration(data.photovoltaicContractDuration));
      }}
      onBack={() => dispatch(stepRevertAttempted())}
    />
  );
}

export default PhotovoltaicContractDurationContainer;
