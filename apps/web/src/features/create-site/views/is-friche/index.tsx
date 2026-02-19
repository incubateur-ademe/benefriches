import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { stepReverted } from "../../core/actions/revert.action";
import { isFricheCompleted } from "../../core/steps/introduction/introduction.actions";
import IsFricheForm from "./IsFricheForm";

const mapIsFricheValue = (isFriche: boolean | undefined) => {
  if (isFriche === undefined) return undefined;
  return isFriche ? "yes" : "no";
};

function IsFricheFormContainer() {
  const dispatch = useAppDispatch();
  const isFriche = useAppSelector((state) => state.siteCreation.siteData.isFriche);

  return (
    <IsFricheForm
      initialValues={{ isFriche: mapIsFricheValue(isFriche) }}
      onSubmit={(data) => {
        dispatch(isFricheCompleted({ isFriche: data.isFriche === "yes" }));
      }}
      onBack={() => dispatch(stepReverted())}
    />
  );
}

export default IsFricheFormContainer;
