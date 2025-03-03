import { isFricheReverted } from "@/features/create-site/core/actions/createSite.actions";
import { isFricheCompleted } from "@/features/create-site/core/createSite.reducer";
import { selectIsFriche } from "@/features/create-site/core/selectors/createSite.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import IsFricheForm from "../../is-friche/IsFricheForm";

const mapIsFricheValue = (isFriche: boolean | undefined) => {
  if (isFriche === undefined) return undefined;
  return isFriche ? "yes" : "no";
};

function IsFricheFormContainer() {
  const dispatch = useAppDispatch();
  const isFriche = useAppSelector(selectIsFriche);

  return (
    <IsFricheForm
      initialValues={{
        isFriche: mapIsFricheValue(isFriche),
      }}
      onSubmit={(data) => {
        dispatch(isFricheCompleted({ isFriche: data.isFriche === "yes" }));
      }}
      onBack={() => dispatch(isFricheReverted())}
    />
  );
}

export default IsFricheFormContainer;
