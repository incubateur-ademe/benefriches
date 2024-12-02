import { revertSiteTypeStep } from "@/features/create-site/application/createSite.actions";
import { siteNatureStepCompleted } from "@/features/create-site/application/createSite.reducer";
import { selectIsFriche } from "@/features/create-site/application/createSite.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import IsFricheForm from "./IsFricheForm";

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
        dispatch(siteNatureStepCompleted({ isFriche: data.isFriche === "yes" }));
      }}
      onBack={() => dispatch(revertSiteTypeStep())}
    />
  );
}

export default IsFricheFormContainer;
