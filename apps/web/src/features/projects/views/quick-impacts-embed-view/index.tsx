import Alert from "@codegouvfr/react-dsfr/Alert";
import { useEffect } from "react";
import type { Route } from "type-route";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { embedRoutes } from "@/embed";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { fetchQuickImpactsForUrbanProjectOnFriche } from "../../application/project-impacts/actions/fetchQuickImpactsForUrbanProjectOnFriche.action";
import { selectDevelopmentScoreDataView } from "../../application/project-impacts/selectors/projectDevelopmentScore.selectors";
import { selectImpactsPageViewData } from "../../application/project-impacts/selectors/projectImpacts.selectors";
import EmbedImpactsView from "./EmbedImpactsView";

type Props = Route<typeof embedRoutes.routes.quickImpactsUrbanProject>["params"];

export default function EmbedImpactsViewContainer({
  siteCityCode,
  siteSurfaceArea,
  details,
}: Props) {
  const { dataLoadingState } = useAppSelector(selectImpactsPageViewData);
  const developmentScoreDataView = useAppSelector(selectDevelopmentScoreDataView);

  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(fetchQuickImpactsForUrbanProjectOnFriche({ siteCityCode, siteSurfaceArea }));
  }, [siteCityCode, siteSurfaceArea, dispatch]);

  if (dataLoadingState === "loading") {
    return <LoadingSpinner />;
  }

  if (dataLoadingState === "success" && developmentScoreDataView?.developmentScore) {
    return (
      <EmbedImpactsView
        siteSurfaceArea={siteSurfaceArea}
        details={details}
        siteCityCode={siteCityCode}
        evaluationPeriod={developmentScoreDataView.modalsData.impactsData.projectionYears.length}
        getUpdateRouteDetailsFn={(details?: string) =>
          embedRoutes.routes.quickImpactsUrbanProject({ siteCityCode, siteSurfaceArea, details })
        }
        {...developmentScoreDataView}
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
