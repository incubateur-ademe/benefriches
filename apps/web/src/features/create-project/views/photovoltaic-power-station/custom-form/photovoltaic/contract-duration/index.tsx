import { AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { completePhotovoltaicContractDuration } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectCreationData } from "@/features/create-project/core/renewable-energy/selectors/renewableEnergy.selector";

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
      onBack={() => dispatch(stepReverted())}
    />
  );
}

export default PhotovoltaicContractDurationContainer;
