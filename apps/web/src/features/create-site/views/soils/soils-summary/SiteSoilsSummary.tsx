import { SoilType } from "@/shared/domain/soils";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { convertSquareMetersToHectares } from "@/shared/services/surface-area/surfaceArea";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";
import SurfaceArea from "@/shared/views/components/SurfaceArea/SurfaceArea";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
  totalSurfaceArea: number;
  soilsDistribution: Partial<Record<SoilType, number>>;
};

const SiteSoilsSummary = ({ totalSurfaceArea, onNext, onBack, soilsDistribution }: Props) => {
  const formattedTotalSurfaceAreaInHectare = formatNumberFr(
    convertSquareMetersToHectares(totalSurfaceArea),
  );

  return (
    <WizardFormLayout title="Récapitulatif des sols du site">
      <p>
        Superficie totale du site :{" "}
        <strong>
          <SurfaceArea surfaceAreaInSquareMeters={totalSurfaceArea} />, soit{" "}
          {formattedTotalSurfaceAreaInHectare} ha
        </strong>
        .
      </p>
      <SurfaceAreaPieChart soilsDistribution={soilsDistribution} />
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </WizardFormLayout>
  );
};

export default SiteSoilsSummary;
