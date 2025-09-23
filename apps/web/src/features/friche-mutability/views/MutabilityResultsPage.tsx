import Button from "@codegouvfr/react-dsfr/Button";
import Notice from "@codegouvfr/react-dsfr/Notice";
import Tooltip from "@codegouvfr/react-dsfr/Tooltip";

import Badge from "@/shared/views/components/Badge/Badge";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { routes } from "@/shared/views/router";

import {
  fricheMutabilityAnalysisReset,
  fricheMutabilityImpactsRequested,
} from "../core/fricheMutability.actions";
import { MutabilityUsage } from "../core/fricheMutability.reducer";
import { selectFricheMutabilityViewData } from "../core/fricheMutability.selectors";

function getTextForReliabilityScore(score: number): string {
  if (score >= 9) return "Très fiable";
  if (score >= 7) return "Fiable";
  if (score >= 5) return "Moyennement fiable";
  if (score >= 3) return "Peu fiable";
  return "Très peu fiable";
}

const getUsageIcon = (usage: MutabilityUsage): string => {
  switch (usage) {
    case "residentiel":
      return "🏠";
    case "equipements":
      return "🏛️";
    case "culture":
      return "🎭";
    case "tertiaire":
      return "🏢";
    case "industrie":
      return "🏭";
    case "renaturation":
      return "🌳";
    case "photovoltaique":
      return "☀️";
    default:
      return "❓";
  }
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-green-700";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
};

const getScoreLabel = (score: number): string => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Favorable";
  if (score >= 40) return "Modéré";
  return "Faible";
};

const getMutabilityUsageDisplayName = (usage: MutabilityUsage): string => {
  return {
    culture: "Culture, tourisme",
    renaturation: "Renaturation",
    equipements: "Équipements publics",
    tertiaire: "Tertiaire",
    residentiel: "Résidentiel",
    photovoltaique: "Photovoltaïque au sol",
    industrie: "Industrie",
  }[usage];
};

export default function MutabilityResultsPage() {
  const dispatch = useAppDispatch();
  const viewData = useAppSelector(selectFricheMutabilityViewData);

  const handleResetAnalysis = () => {
    dispatch(fricheMutabilityAnalysisReset());
    routes.fricheMutability().push();
  };

  const handleDiscoverImpactsClick = () => {
    if (!viewData.evaluationResults) return;
    void dispatch(fricheMutabilityImpactsRequested({ evaluationId: "TO CHANGE" }));
  };

  if (viewData.isCreatingProject) {
    return <LoadingSpinner loadingText="Évaluation des impacts en cours..." />;
  }

  return (
    <section className="fr-container py-10">
      <h1>Résultats de la compatibilité de la friche</h1>
      <div className="flex items-center justify-between mt-8">
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
      <div className="flex flex-col md:flex-row gap-8">
        {viewData.evaluationResults?.top3MutabilityUsages.map((result) => (
          <article
            key={result.usage}
            className="flex-1 border-1 border-border-grey rounded-xl py-8 px-6"
          >
            <span className="text-6xl mb-6 block text-center" aria-hidden="true">
              {getUsageIcon(result.usage)}
            </span>
            <div className="flex justify-center items-center gap-2 mb-6">
              <Badge small style="blue">
                #{result.rank}
              </Badge>
              <h3 className="mb-0">{getMutabilityUsageDisplayName(result.usage)}</h3>
            </div>

            <div className="flex justify-center items-center gap-2 mb-6">
              <h4 className="text-sm text-gray-600 font-normal mb-0">Indice de compatibilité :</h4>
              <span className={`text-sm font-bold ${getScoreColor(result.score)}`}>
                {result.score.toFixed(0)}% ({getScoreLabel(result.score)})
              </span>
            </div>

            <div className="text-center">
              <Button
                priority="primary"
                onClick={() => {
                  handleDiscoverImpactsClick();
                }}
                disabled={viewData.isCreatingProject}
              >
                {viewData.isCreatingProject ? (
                  <>
                    <span
                      className="fr-icon-refresh-line fr-icon--sm animate-spin"
                      aria-hidden="true"
                    />
                    <span className="ml-2">Création...</span>
                  </>
                ) : (
                  "Découvrir les impacts"
                )}
              </Button>
            </div>
          </article>
        ))}
      </div>
      <Notice
        title="Comment interpréter ces résultats ?"
        description=" L'indice de compatibilité évalue la capacité de transformation de votre site selon différents
        critères (accessibilité, réseaux, contraintes environnementales, etc.). Plus l'indice est
        élevé, plus le type de reconversion est adapté à votre contexte local."
        severity="info"
        className="mt-8"
      />

      {viewData.hasError && viewData.evaluationError && (
        <div className="fr-alert fr-alert--error fr-mb-4w">
          <p className="fr-alert__body fr-mb-0">{viewData.evaluationError}</p>
        </div>
      )}
    </section>
  );
}
