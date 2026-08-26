import Alert from "@codegouvfr/react-dsfr/Alert";
import { useEffect } from "react";
import { Route } from "type-route";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { embedRoutes } from "@/embed";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import {
  evaluationPeriodUpdated,
  viewModeUpdated,
} from "../../application/project-impacts/actions";
import { fetchQuickImpactsForUrbanProjectOnFriche } from "../../application/project-impacts/actions/fetchQuickImpactsForUrbanProjectOnFriche.action";
import { ViewMode } from "../../application/project-impacts/projectImpacts.reducer";
import { selectImpactsPageViewData } from "../../application/project-impacts/selectors/projectImpacts.selectors";
import ImpactModalDescriptionProvider from "../impact-description-modals/ImpactModalDescription";
import EmbedImpactsView from "./EmbedImpactsView";

type Props = {
  siteCityCode: string;
  siteSurfaceArea: number;
};

const DEFAULT_EVALUATION_PERIOD = 30;

export default function EmbedImpactsViewContainer({ siteCityCode, siteSurfaceArea }: Props) {
  const { dataLoadingState, currentViewMode, evaluationPeriod, contextData, impactsData } =
    useAppSelector(selectImpactsPageViewData);

  const dispatch = useAppDispatch();

  const route = embedRoutes.useRoute() as Route<typeof embedRoutes.routes.quickImpactsUrbanProject>;

  useEffect(() => {
    void dispatch(fetchQuickImpactsForUrbanProjectOnFriche({ siteCityCode, siteSurfaceArea }));
  }, [siteCityCode, siteSurfaceArea, dispatch]);

  if (dataLoadingState.impacts === "loading") {
    return <LoadingSpinner />;
  }

  if (dataLoadingState.impacts === "success" && contextData) {
    return (
      <ImpactModalDescriptionProvider
        route={route}
        contextData={contextData}
        impactsData={impactsData!}
        getRouteFn={embedRoutes.routes.quickImpactsUrbanProject}
      >
        <EmbedImpactsView
          evaluationPeriod={evaluationPeriod ?? DEFAULT_EVALUATION_PERIOD}
          currentViewMode={currentViewMode}
          onCurrentViewModeChange={(viewMode: ViewMode) => dispatch(viewModeUpdated(viewMode))}
          onEvaluationPeriodChange={(ev: number) => dispatch(evaluationPeriodUpdated(ev))}
          siteCity={contextData.siteAddress.label}
          siteSurfaceArea={contextData.siteSurfaceArea}
        />
      </ImpactModalDescriptionProvider>
    );
  }

  if (dataLoadingState.impacts === "error") {
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
