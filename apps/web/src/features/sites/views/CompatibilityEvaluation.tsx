import Tooltip from "@codegouvfr/react-dsfr/Tooltip";
import type { MutabilityUsage } from "shared";

import { getTextForReliabilityScore } from "@/features/reconversion-compatibility/core/score";
import CompatibilityCard from "@/features/reconversion-compatibility/views/results/CompatibilityCard";

import CompatibilityResultRow from "./CompatibilityResultRow";

const PODIUM_LENGTH = 3;

type Props = {
  compatibilityEvaluation: {
    results: { usage: MutabilityUsage; score: number }[];
    reliabilityScore: number;
  } | null;
};

function CompatibilityEvaluation({ compatibilityEvaluation }: Props) {
  if (!compatibilityEvaluation) {
    return (
      <p className="text-gray-700 dark:text-gray-300">
        Aucune évaluation de compatibilité disponible pour ce site.
      </p>
    );
  }

  const allRankedResults = compatibilityEvaluation.results
    .toSorted((a, b) => b.score - a.score)
    .map((result, index) => ({
      ...result,
      rank: index + 1,
    }));

  const rankedPodium = allRankedResults.slice(0, PODIUM_LENGTH);

  return (
    <section>
      <h3 className="text-2xl mb-6">Podium des projets d'aménagement</h3>

      {compatibilityEvaluation.reliabilityScore && (
        <p className="mb-6">
          Classés par score de compatibilité avec la friche • Indice de fiabilité :{" "}
          {compatibilityEvaluation.reliabilityScore}/10{" "}
          <Tooltip title={getTextForReliabilityScore(compatibilityEvaluation.reliabilityScore)} />
        </p>
      )}

      <section className="flex flex-col md:flex-row gap-8">
        {rankedPodium.map((result) => (
          <CompatibilityCard
            key={result.usage}
            usage={result.usage}
            score={result.score}
            rank={result.rank}
          />
        ))}
      </section>

      <section className="mt-10">
        <h4 className="text-xl mb-4">Tous les résultats</h4>
        {allRankedResults.map((result) => (
          <CompatibilityResultRow
            key={result.usage}
            usage={result.usage}
            score={result.score}
            rank={result.rank}
          />
        ))}
      </section>
    </section>
  );
}

export default CompatibilityEvaluation;
