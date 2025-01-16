import { completeSoilsSummary, revertStep } from "@/features/create-site/core/createSite.reducer";
import { AppDispatch } from "@/shared/core/store-config/store";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { SiteDraft } from "../../../../core/siteFoncier.types";
import SiteSoilsSummary from "./SiteSoilsSummary";

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
