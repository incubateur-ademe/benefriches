import SiteOperatorForm, { FormValues } from "./SiteOperatorForm";

import {
  goToStep,
  ProjectCreationStep,
  setFutureOperator,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: FormValues) => {
      dispatch(setFutureOperator(data.futureOperator));
      dispatch(
        goToStep(ProjectCreationStep.STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER),
      );
    },
  };
};

function SiteOperatorFormContainer() {
  const dispatch = useAppDispatch();

  return <SiteOperatorForm {...mapProps(dispatch)} />;
}

export default SiteOperatorFormContainer;
