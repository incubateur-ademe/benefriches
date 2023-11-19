import { SiteDraft } from "../../../domain/siteFoncier.types";
import SiteSoilsSummary from "./SiteSoilsSummary";

import {
  goToStep,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch, siteData: Partial<SiteDraft>) => {
  return {
    onNext: () => dispatch(goToStep(SiteCreationStep.SOILS_CARBON_STORAGE)),
    soilsSurfaceAreas: siteData.soilsSurfaceAreas ?? {},
    totalSurfaceArea: siteData.surfaceArea ?? 0,
  };
};

function SiteSoilsSummaryContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector((state) => state.siteCreation.siteData);

  return <SiteSoilsSummary {...mapProps(dispatch, siteData)} />;
}

export default SiteSoilsSummaryContainer;
