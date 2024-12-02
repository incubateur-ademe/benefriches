import { revertSoilsSelectionStep } from "@/features/create-site/application/createSite.actions";
import {
  selectIsFriche,
  selectSiteSoils,
} from "@/features/create-site/application/createSite.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { completeSoils } from "../../../../application/createSite.reducer";
import SiteSoilsForm, { FormValues } from "./SoilsForm";

const SiteSoilsFormContainer = () => {
  const dispatch = useAppDispatch();
  const isFriche = useAppSelector(selectIsFriche);
  const soils = useAppSelector(selectSiteSoils);

  return (
    <SiteSoilsForm
      isFriche={!!isFriche}
      initialValues={{
        soils: soils ?? [],
      }}
      onSubmit={(formData: FormValues) => {
        dispatch(completeSoils({ soils: formData.soils }));
      }}
      onBack={() => {
        dispatch(revertSoilsSelectionStep());
      }}
    />
  );
};

export default SiteSoilsFormContainer;
