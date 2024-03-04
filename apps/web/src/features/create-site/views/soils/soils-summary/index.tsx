import { SiteDraft } from "../../../domain/siteFoncier.types";
import SiteSoilsSummary from "./SiteSoilsSummary";

import { AppDispatch } from "@/app/application/store";
import {
  completeSoilsSummary,
  revertStep,
} from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch, siteData: Partial<SiteDraft>) => {
  return {
    onNext: () => dispatch(completeSoilsSummary()),
    onBack: () => {
      dispatch(revertStep());
    },
    soilsDistribution: siteData.soilsDistribution ?? {},
    totalSurfaceArea: siteData.surfaceArea ?? 0,
  };
};

function SiteSoilsSummaryContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector((state) => state.siteCreation.siteData);

  return <SiteSoilsSummary {...mapProps(dispatch, siteData)} />;
}

export default SiteSoilsSummaryContainer;
