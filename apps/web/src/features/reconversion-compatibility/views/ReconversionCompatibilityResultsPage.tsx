import Button from "@codegouvfr/react-dsfr/Button";
import Tooltip from "@codegouvfr/react-dsfr/Tooltip";
import { useEffect } from "react";

import { compatibilityResultDiscoverImpactsClicked, trackEvent } from "@/shared/views/analytics";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { routes, useRoute } from "@/shared/views/router";

import {
  reconversionCompatibilityEvaluationReset,
  reconversionCompatibilityEvaluationResultsRequested,
  reconversionCompatibilityResultImpactsRequested,
} from "../core/reconversionCompatibilityEvaluation.actions";
import { MutabilityUsage } from "../core/reconversionCompatibilityEvaluation.reducer";
import { selectReconversionCompatibilityViewData } from "../core/reconversionCompatibilityEvaluation.selectors";
import CompatibilityCard from "./CompatibilityCard";

function getTextForReliabilityScore(score: number): string {
  if (score >= 9) return "Très fiable";
  if (score >= 7) return "Fiable";
  if (score >= 5) return "Moyennement fiable";
  if (score >= 3) return "Peu fiable";
  return "Très peu fiable";
}

export default function ReconversionCompatibilityResultsPage() {
  const { params } = useRoute();
  const queryParams = params as { mutafrichesId: string };
  const dispatch = useAppDispatch();
  const viewData = useAppSelector(selectReconversionCompatibilityViewData);

  useEffect(() => {
    void dispatch(
      reconversionCompatibilityEvaluationResultsRequested({
        mutafrichesId: queryParams.mutafrichesId,
      }),
    );
  }, [dispatch, queryParams.mutafrichesId]);

  const handleResetAnalysis = () => {
    dispatch(reconversionCompatibilityEvaluationReset());
    routes.evaluateReconversionCompatibility().push();
  };

  const handleDiscoverImpactsClick = (usage: MutabilityUsage) => {
    if (!viewData.evaluationResults) return;
    trackEvent(compatibilityResultDiscoverImpactsClicked({ usage }));
    void dispatch(reconversionCompatibilityResultImpactsRequested({ usage }));
  };

  if (viewData.isCreatingProject) {
    return <LoadingSpinner loadingText="Évaluation des impacts en cours..." />;
  }

  if (viewData.evaluationResultsLoadingState === "loading") {
    return <LoadingSpinner loadingText="Chargement des résultats..." />;
  }

  return (
    <section className="fr-container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="m-0">Podium des projets d'aménagement</h1>
        <Button
          priority="tertiary"
          size="small"
          iconId="fr-icon-arrow-left-line"
          onClick={handleResetAnalysis}
          disabled={viewData.isCreatingProject}
        >
          Refaire l'analyse
        </Button>
      </div>

      {viewData.evaluationResults?.reliabilityScore && (
        <p>
          Classés par score de compatibilité avec la friche • Indice de fiabilité :{" "}
          {viewData.evaluationResults.reliabilityScore}/10{" "}
          <Tooltip
            title={getTextForReliabilityScore(viewData.evaluationResults.reliabilityScore)}
          />
        </p>
      )}
      <div className="flex flex-col md:flex-row gap-8">
        {viewData.evaluationResults?.top3MutabilityUsages.map((result) => (
          <CompatibilityCard
            usage={result.usage}
            score={result.score}
            rank={result.rank}
            onDiscoverImpactsClick={() => {
              handleDiscoverImpactsClick(result.usage);
            }}
            key={result.usage}
          />
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-xl">💡 À propos des résultats</h2>
        <p>
          L'indice de compatibilité évalue la capacité de transformation de votre site selon
          différents critères (accessibilité, réseaux, contraintes environnementales, etc.). Plus
          l'indice est élevé, plus le type de reconversion est adapté à votre contexte local.
        </p>
      </div>

      {viewData.hasError && viewData.evaluationError && (
        <div className="fr-alert fr-alert--error fr-mb-4w">
          <p className="fr-alert__body fr-mb-0">{viewData.evaluationError}</p>
        </div>
      )}
    </section>
  );
}
