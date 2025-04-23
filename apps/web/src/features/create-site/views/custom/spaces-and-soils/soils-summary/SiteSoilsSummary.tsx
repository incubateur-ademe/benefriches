import { convertSquareMetersToHectares, SoilsDistribution } from "shared";

import { formatNumberFr, formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
  totalSurfaceArea: number;
  soilsDistribution: SoilsDistribution;
  wasSoilsDistributionAssignedByBenefriches: boolean;
};

const SiteSoilsSummary = ({
  totalSurfaceArea,
  onNext,
  onBack,
  soilsDistribution,
  wasSoilsDistributionAssignedByBenefriches,
}: Props) => {
  const formattedTotalSurfaceAreaInHectare = formatNumberFr(
    convertSquareMetersToHectares(totalSurfaceArea),
  );

  return (
    <WizardFormLayout
      title="Récapitulatif de l'occupation des sols"
      instructions={
        wasSoilsDistributionAssignedByBenefriches ? (
          <>
            <p>
              Les types de sols et leur répartition ont été affectés automatiquement par Bénéfriches
              en se basant sur les moyennes observées pour ce type de site.
            </p>
            <p>
              Si cela ne correspond pas à la réalité de votre site, vous pouvez retourner à la
              question précédente et sélectionner "Oui, je connais les types d'espaces" pour ensuite
              sélectionner vous-même les types d'espaces.
            </p>
          </>
        ) : null
      }
    >
      <p>
        Superficie totale du site :{" "}
        <strong>
          {formatSurfaceArea(totalSurfaceArea)}, soit {formattedTotalSurfaceAreaInHectare} ha
        </strong>
        .
      </p>
      <SurfaceAreaPieChart
        soilsDistribution={soilsDistribution}
        exportConfig={{
          title: "Récapitulatif de l'occupation des sols",
          caption: `Surface totale : ${formatSurfaceArea(totalSurfaceArea)}`,
        }}
      />
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </WizardFormLayout>
  );
};

export default SiteSoilsSummary;
