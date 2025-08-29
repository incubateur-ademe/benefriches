import Alert from "@codegouvfr/react-dsfr/Alert";
import { useEffect } from "react";

import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { viewModeUpdated } from "../../application/project-impacts/actions";
import { fetchQuickImpactsForUrbanProjectOnFriche } from "../../application/project-impacts/fetchQuickImpactsForUrbanProjectOnFriche.action";
import { ViewMode } from "../../application/project-impacts/projectImpacts.reducer";
import EmbedImpactsView from "./EmbedImpactsView";

type Props = {
  siteCityCode: string;
  siteSurfaceArea: number;
};

const evaluationPeriod = 30;

export default function EmbedImpactsViewContainer({ siteCityCode, siteSurfaceArea }: Props) {
  const { dataLoadingState, currentViewMode, relatedSiteData } = useAppSelector(
    (state) => state.projectImpacts,
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(fetchQuickImpactsForUrbanProjectOnFriche({ siteCityCode, siteSurfaceArea }));
  }, [siteCityCode, siteSurfaceArea, dispatch]);

  if (dataLoadingState === "loading") {
    return <LoadingSpinner />;
  }

  if (dataLoadingState === "success" && relatedSiteData) {
    return (
      <EmbedImpactsView
        evaluationPeriod={evaluationPeriod}
        currentViewMode={currentViewMode}
        onCurrentViewModeChange={(viewMode: ViewMode) => dispatch(viewModeUpdated(viewMode))}
        siteCity={relatedSiteData.addressLabel}
        siteSurfaceArea={relatedSiteData.surfaceArea}
      />
    );
  }

  if (dataLoadingState === "error") {
    return (
      <Alert
        description="Une erreur s'est produite lors du calcul des données, veuillez réessayer."
        severity="error"
        title="Impossible de calculer les impacts pour cette friche"
        className="m-7"
      />
    );
  }

  return null;
}
