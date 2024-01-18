import FricheRecentAccidentsForm, { FormValues } from "./FricheRecentAccidentsForm";

import {
  goToStep,
  setFricheRecentAccidents,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: FormValues) => {
      const { hasRecentAccidents, ...dataRest } = data;
      dispatch(
        setFricheRecentAccidents({
          hasRecentAccidents: hasRecentAccidents === "yes",
          ...dataRest,
        }),
      );
      dispatch(goToStep(SiteCreationStep.YEARLY_EXPENSES));
    },
  };
};

function FricheRecentAccidentsFormContainer() {
  const dispatch = useAppDispatch();

  return <FricheRecentAccidentsForm {...mapProps(dispatch)} />;
}

export default FricheRecentAccidentsFormContainer;
