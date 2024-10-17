import { SoilsDistribution } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";

type Props = {
  onNext: () => void;
  onBack: () => void;
  siteSoilsDistribution: SoilsDistribution;
  projectSoilsDistribution: SoilsDistribution;
};

const SiteSoilsSummary = ({
  onNext,
  onBack,
  siteSoilsDistribution,
  projectSoilsDistribution,
}: Props) => {
  return (
    <>
      <h2>Récapitulatif de la répartition des sols</h2>
      <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6 tw-pb-10">
        <div className="tw-border tw-border-solid tw-border-borderGrey tw-p-8">
          <h3 className="tw-uppercase tw-text-base">Site existant</h3>
          <SurfaceAreaPieChart soilsDistribution={siteSoilsDistribution} />
        </div>
        <div className="tw-border tw-border-solid tw-border-borderGrey tw-p-8">
          <h3 className="tw-uppercase tw-text-base">Site avec projet</h3>
          <SurfaceAreaPieChart soilsDistribution={projectSoilsDistribution} />
        </div>
      </div>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </>
  );
};

export default SiteSoilsSummary;
