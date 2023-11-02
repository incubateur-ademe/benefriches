import SiteReinstatementContractOwnerForm, {
  FormValues,
} from "./SiteReinstatementContractOwnerForm";

import {
  goToStep,
  ProjectCreationStep,
  setReinstatementContractOwner,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: FormValues) => {
      dispatch(setReinstatementContractOwner(data.reinstatementContractOwner));
      dispatch(
        goToStep(ProjectCreationStep.STAKEHOLDERS_REINSTATEMENT_FULL_TIME_JOBS),
      );
    },
  };
};

function SiteReinstatementContractOwnerFormContainer() {
  const dispatch = useAppDispatch();

  return <SiteReinstatementContractOwnerForm {...mapProps(dispatch)} />;
}

export default SiteReinstatementContractOwnerFormContainer;
