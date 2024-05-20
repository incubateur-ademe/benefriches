import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";

type Props = {
  minimumRecommendedMineralSurfaceArea: number;
  minimumRecommendedImpermeableSurfaceArea: number;
  photovoltaicPanelsSurfaceArea: number;
};

function FutureSoilsSurfaceAreaInstructions({
  minimumRecommendedMineralSurfaceArea,
  minimumRecommendedImpermeableSurfaceArea,
  photovoltaicPanelsSurfaceArea,
}: Props) {
  return (
    <>
      <p>
        La part de bâtiment existant non intégrée à la répartition sera démolie. La part de bâtiment
        intégrée peut inclure de la construction neuve.
      </p>
      <p>
        Compte tenu des ratios usuels, les <strong>sols imperméabilisés</strong> devraient faire au
        minimum <strong>{formatSurfaceArea(minimumRecommendedImpermeableSurfaceArea)}</strong>.
        C'est la superficie qu'occuperont les <strong>fondations des panneaux</strong>.
      </p>
      <p>
        Les <strong>sols perméables</strong> minéraux devraient faire au minimum{" "}
        <strong>{formatSurfaceArea(minimumRecommendedMineralSurfaceArea)}</strong>. C'est la
        superficie requises pour les <strong>pistes d'accès</strong>.
      </p>
      <p>
        Les <strong>surfaces compatibles avec la surface des panneaux</strong> (c'est-à-dire tous
        les sols hors bâtiments, forêts, prairie arborée, sol arboré, zone humide et plan d'eau)
        devraient totaliser au minimum{" "}
        <strong>{formatSurfaceArea(photovoltaicPanelsSurfaceArea)}</strong>.
      </p>
    </>
  );
}

export default FutureSoilsSurfaceAreaInstructions;
