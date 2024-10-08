import { AppDispatch } from "@/app/application/store";
import { revertFricheAccidentsStep } from "@/features/create-site/application/createSite.actions";
import { completeFricheAccidents } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import FricheAccidentsForm, { FormValues } from "./FricheAccidentsForm";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onBack: () => {
      dispatch(revertFricheAccidentsStep());
    },
    onSubmit: (data: FormValues) => {
      const { hasRecentAccidents, ...dataRest } = data;
      dispatch(
        completeFricheAccidents({
          hasRecentAccidents: hasRecentAccidents === "yes",
          ...dataRest,
        }),
      );
    },
  };
};

function FricheAccidentsFormContainer() {
  const dispatch = useAppDispatch();

  return <FricheAccidentsForm {...mapProps(dispatch)} />;
}

export default FricheAccidentsFormContainer;
