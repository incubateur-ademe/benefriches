import Button from "@codegouvfr/react-dsfr/Button";
import Tooltip from "@codegouvfr/react-dsfr/Tooltip";

import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { ReconversionCompatibilityEvaluationViewData } from "../../core/reconversionCompatibilityEvaluation.selectors";
import { getTextForReliabilityScore } from "../../core/score";
import CompatibilityCard from "./CompatibilityCard";

type Props = {
  onFricheSaved: () => void;
  onResetAnalysis: () => void;
  viewData: ReconversionCompatibilityEvaluationViewData;
};

export default function ReconversionCompatibilityResultsPage({
  onFricheSaved,
  onResetAnalysis,
  viewData,
}: Props) {
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
          onClick={onResetAnalysis}
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
      {viewData.hasError && viewData.evaluationError && (
        <div className="fr-alert fr-alert--error fr-mb-4w">
          <p className="fr-alert__body fr-mb-0">{viewData.evaluationError}</p>
        </div>
      )}
      <section className="flex flex-col md:flex-row gap-8">
        {viewData.evaluationResults?.top3MutabilityUsages.map((result) => (
          <CompatibilityCard
            usage={result.usage}
            score={result.score}
            rank={result.rank}
            key={result.usage}
          />
        ))}
      </section>
      <div className="mt-10 flex flex-col items-end gap-2">
        <Button onClick={onFricheSaved}>Sauvegarder ma friche</Button>
        <p className="text-sm">
          Vous pourrez ensuite évaluer les impacts socio-économiques d'un projet.
        </p>
      </div>
    </section>
  );
}
