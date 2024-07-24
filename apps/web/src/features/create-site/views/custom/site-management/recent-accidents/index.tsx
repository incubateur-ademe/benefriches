import FricheRecentAccidentsForm, { FormValues } from "./FricheRecentAccidentsForm";

import { AppDispatch } from "@/app/application/store";
import { revertFricheRecentAccidentsStep } from "@/features/create-site/application/createSite.actions";
import { completeFricheRecentAccidents } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onBack: () => {
      dispatch(revertFricheRecentAccidentsStep());
    },
    onSubmit: (data: FormValues) => {
      const { hasRecentAccidents, ...dataRest } = data;
      dispatch(
        completeFricheRecentAccidents({
          hasRecentAccidents: hasRecentAccidents === "yes",
          ...dataRest,
        }),
      );
    },
  };
};

function FricheRecentAccidentsFormContainer() {
  const dispatch = useAppDispatch();

  return <FricheRecentAccidentsForm {...mapProps(dispatch)} />;
}

export default FricheRecentAccidentsFormContainer;
