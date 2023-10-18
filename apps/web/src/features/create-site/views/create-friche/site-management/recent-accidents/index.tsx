import FricheRecentAccidentsForm, {
  FormValues,
} from "./FricheRecentAccidentsForm";

import { setRecentAccidents } from "@/features/create-site/application/createFriche.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: FormValues) => {
      const { hasRecentAccidents, ...dataRest } = data;
      dispatch(
        setRecentAccidents({
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
