import {
  goToStep,
  setSoilsSurfaceAreas,
  SiteCreationStep,
} from "../../../application/createSite.reducer";
import { SiteDraft } from "../../../domain/siteFoncier.types";
import SiteSoilsSurfaceAreasForm, { type FormValues } from "./SoilsSurfaceAreasForm";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch, siteData: Partial<SiteDraft>) => {
  return {
    onSubmit: (formData: FormValues) => {
      dispatch(setSoilsSurfaceAreas(formData));
      dispatch(goToStep(SiteCreationStep.SOILS_SUMMARY));
    },
    soils: siteData.soils ?? [],
    totalSurfaceArea: siteData.surfaceArea ?? 0,
  };
};

function SiteSoilsSurfaceAreasFormContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector((state) => state.siteCreation.siteData);

  return <SiteSoilsSurfaceAreasForm {...mapProps(dispatch, siteData)} />;
}

export default SiteSoilsSurfaceAreasFormContainer;
