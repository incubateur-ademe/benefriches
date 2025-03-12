import { revertSoilsSelectionStep } from "@/features/create-site/core/actions/createSite.actions";
import { selectSiteSoils } from "@/features/create-site/core/selectors/createSite.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { completeSoils } from "../../../../core/createSite.reducer";
import SiteSoilsForm, { FormValues } from "./SoilsForm";

const SiteSoilsFormContainer = () => {
  const dispatch = useAppDispatch();
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);
  const soils = useAppSelector(selectSiteSoils);

  return (
    <SiteSoilsForm
      siteNature={siteNature}
      initialValues={{
        soils,
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
