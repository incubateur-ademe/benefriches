import SiteTypeForm from "./SiteTypeForm";

import {
  goToStep,
  setIsFriche,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function SiteTypeFormContainer() {
  const dispatch = useAppDispatch();
  return (
    <SiteTypeForm
      onSubmit={(data) => {
        dispatch(setIsFriche(data.isFriche === "yes"));
        dispatch(goToStep(SiteCreationStep.ADDRESS));
      }}
    />
  );
}

export default SiteTypeFormContainer;
