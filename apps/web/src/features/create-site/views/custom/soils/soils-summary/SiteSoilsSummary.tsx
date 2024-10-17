import { SoilsDistribution } from "shared";

import { formatNumberFr, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import { convertSquareMetersToHectares } from "@/shared/services/surface-area/surfaceArea";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
  totalSurfaceArea: number;
  soilsDistribution: SoilsDistribution;
};

const SiteSoilsSummary = ({ totalSurfaceArea, onNext, onBack, soilsDistribution }: Props) => {
  const formattedTotalSurfaceAreaInHectare = formatNumberFr(
    convertSquareMetersToHectares(totalSurfaceArea),
  );

  return (
    <WizardFormLayout title="Récapitulatif de la répartition des sols">
      <p>
        Superficie totale du site :{" "}
        <strong>
          {formatSurfaceArea(totalSurfaceArea)}, soit {formattedTotalSurfaceAreaInHectare} ha
        </strong>
        .
      </p>
      <SurfaceAreaPieChart soilsDistribution={soilsDistribution} />
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </WizardFormLayout>
  );
};

export default SiteSoilsSummary;
