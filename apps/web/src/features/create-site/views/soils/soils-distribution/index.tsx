import {
  goToStep,
  setSoilsDistribution,
  SiteCreationStep,
} from "../../../application/createSite.reducer";
import { SiteDraft } from "../../../domain/siteFoncier.types";
import SiteSoilsDistributionForm, { type FormValues } from "./SoilsDistributionForm";

import { AppDispatch } from "@/app/application/store";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch, siteData: Partial<SiteDraft>) => {
  return {
    onSubmit: (formData: FormValues) => {
      dispatch(setSoilsDistribution(formData));
      dispatch(goToStep(SiteCreationStep.SOILS_SUMMARY));
    },
    soils: siteData.soils ?? [],
    totalSurfaceArea: siteData.surfaceArea ?? 0,
  };
};

function SiteSoilsDistributionFormContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector((state) => state.siteCreation.siteData);

  return <SiteSoilsDistributionForm {...mapProps(dispatch, siteData)} />;
}

export default SiteSoilsDistributionFormContainer;
