import Button from "@codegouvfr/react-dsfr/Button";
import Notice from "@codegouvfr/react-dsfr/Notice";

import Badge from "@/shared/views/components/Badge/Badge";

import { MutabilityEvaluationResults, MutabilityUsage } from "../core/fricheMutability.reducer";

type MutabilityResultsDisplayProps = {
  results: MutabilityEvaluationResults["top3Usages"];
  onCreateProject: (usage: MutabilityUsage) => Promise<void>;
  isCreatingProject: boolean;
};

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

export default function MutabilityResultsDisplay({
  results,
  onCreateProject,
  isCreatingProject,
}: MutabilityResultsDisplayProps) {
  return (
    <section>
      <div className="flex flex-col md:flex-row gap-8">
        {results.map((result) => (
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
                onClick={() => onCreateProject(result.usage)}
                disabled={isCreatingProject}
              >
                {isCreatingProject ? (
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
    </section>
  );
}
