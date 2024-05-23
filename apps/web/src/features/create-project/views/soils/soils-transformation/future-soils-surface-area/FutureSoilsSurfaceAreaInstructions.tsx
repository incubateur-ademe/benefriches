import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import FormDefinition from "@/shared/views/layout/WizardFormLayout/FormDefinition";
import FormWarning from "@/shared/views/layout/WizardFormLayout/FormWarning";

type Props = {
  availableSurfaceArea: number;
  minimumRecommendedMineralSurfaceArea: number;
  minimumRecommendedImpermeableSurfaceArea: number;
  photovoltaicPanelsSurfaceArea: number;
};

function FutureSoilsSurfaceAreaInstructions({
  availableSurfaceArea,
  minimumRecommendedMineralSurfaceArea,
  minimumRecommendedImpermeableSurfaceArea,
  photovoltaicPanelsSurfaceArea,
}: Props) {
  return (
    <>
      <FormWarning>
        <p className="tw-text-sm">
          Le total des surfaces ne peut pas dépassser{" "}
          <strong>{formatSurfaceArea(availableSurfaceArea)}.</strong>
        </p>
        <p className="tw-text-sm">
          Compte tenu des ratios usuels, les sols imperméabilisés devraient faire au minimum{" "}
          <strong>{formatSurfaceArea(minimumRecommendedImpermeableSurfaceArea)}</strong>. C'est la
          superficie qu'occuperont les fondations des panneaux.
        </p>
        <p className="tw-text-sm">
          Les sols perméables minéraux devraient faire au minimum{" "}
          <strong>{formatSurfaceArea(minimumRecommendedMineralSurfaceArea)}</strong>. C'est la
          superficie requises pour les pistes d'accès.
        </p>
        <p className="tw-text-sm">
          Les surfaces compatibles avec la surface des panneaux (c'est-à-dire tous les sols hors
          bâtiments, forêts, prairie arborée, sol arboré, zone humide et plan d'eau) devraient
          totaliser au minimum <strong>{formatSurfaceArea(photovoltaicPanelsSurfaceArea)}</strong>.
        </p>
      </FormWarning>
      <FormDefinition>
        Il n'est pas possible d'augmenter la surface des <strong>espaces naturels</strong> (forêts,
        prairies, zones humides). En effet, le sol est un milieu vivant, dont la création en
        conditions naturelles (pédogénèse) prend plusieurs centaines d'années. C'est pourquoi la
        création de surfaces naturelles est illusoire sur le temps de vie du projet. En revanche,
        vous pouvez augmenter la surfaces des sols végétalisés (enherbés, arbustifs ou arborés).
      </FormDefinition>
    </>
  );
}

export default FutureSoilsSurfaceAreaInstructions;
