import Button from "@codegouvfr/react-dsfr/Button";
import Tooltip from "@codegouvfr/react-dsfr/Tooltip";
import { useEffect } from "react";

import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { BENEFRICHES_ENV } from "@/shared/views/envVars";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import {
  fricheMutabilityAnalysisReset,
  fricheMutabilityEvaluationCompleted,
  fricheMutabilityImpactsRequested,
} from "../core/fricheMutability.actions";
import { selectFricheMutabilityViewData } from "../core/fricheMutability.selectors";
import MutabilityResultsDisplay from "./MutabilityResultsDisplay";
import { MutafrichesEvaluationEvent } from "./mutafriches.types";

function getTextForReliabilityScore(score: number): string {
  if (score >= 9) return "Très fiable";
  if (score >= 7) return "Fiable";
  if (score >= 5) return "Moyennement fiable";
  if (score >= 3) return "Peu fiable";
  return "Très peu fiable";
}

export default function FricheMutabilityPage() {
  const dispatch = useAppDispatch();
  const viewData = useAppSelector(selectFricheMutabilityViewData);

  const handleDiscoverImpactsClick = () => {
    if (!viewData.evaluationResults) return;
    void dispatch(fricheMutabilityImpactsRequested({ evaluationId: "TO CHANGE" }));
  };

  const handleResetAnalysis = () => {
    dispatch(fricheMutabilityAnalysisReset());
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent<MutafrichesEvaluationEvent>) => {
      // only handle messages from Mutafriches
      if (event.origin !== BENEFRICHES_ENV.mutafrichesUrl) {
        // eslint-disable-next-line no-console
        console.warn("Ignored message from:", event.origin);
        return;
      }

      const { type, data } = event.data;

      switch (type) {
        case "mutafriches:completed":
          // eslint-disable-next-line no-case-declarations
          const payload = {
            evaluationId: data.evaluationId,
            top3Usages: data.top3Usages.map((usage) => ({
              usage: usage.usage,
              score: usage.indiceMutabilite,
              rank: usage.rang,
            })),
            reliabilityScore: data.fiabilite.note,
          };
          dispatch(fricheMutabilityEvaluationCompleted(payload));
          break;
        default:
          break;
      }
      window.scrollTo(0, 0);
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [dispatch]);

  if (viewData.isCreatingProject) {
    return <LoadingSpinner loadingText="Évaluation des impacts en cours..." />;
  }

  return (
    <section className="py-10">
      <h1 className="fr-container">Analyse de la compatibilité de la friche</h1>

      {!viewData.isAnalysisComplete ? (
        <iframe
          width="100%"
          height="800px"
          src={`${BENEFRICHES_ENV.mutafrichesUrl}?integrator=${BENEFRICHES_ENV.mutafrichesIntegrator}&callbackUrl=${encodeURIComponent(
            `${window.location.origin}/callback`,
          )}&callbackLabel=${encodeURIComponent("Retour vers Bénéfriches")}`}
          title="Explorer la compatibilité de ma friche"
        />
      ) : (
        <div className="fr-container mt-8">
          <div className="flex items-center justify-between">
            <h2>🎯 Projets d'aménagement appropriés</h2>
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
              Classés par score de compatibilité • Indice de fiabilité :{" "}
              {viewData.evaluationResults.reliabilityScore}/10{" "}
              <Tooltip
                title={getTextForReliabilityScore(viewData.evaluationResults.reliabilityScore)}
              />
            </p>
          )}

          {viewData.hasError && viewData.evaluationError && (
            <div className="fr-alert fr-alert--error fr-mb-4w">
              <p className="fr-alert__body fr-mb-0">{viewData.evaluationError}</p>
            </div>
          )}

          {viewData.evaluationResults && (
            <MutabilityResultsDisplay
              results={viewData.evaluationResults.top3MutabilityUsages}
              onDiscoverImpactsClick={handleDiscoverImpactsClick}
              isCreatingProject={viewData.isCreatingProject}
            />
          )}
        </div>
      )}
    </section>
  );
}
