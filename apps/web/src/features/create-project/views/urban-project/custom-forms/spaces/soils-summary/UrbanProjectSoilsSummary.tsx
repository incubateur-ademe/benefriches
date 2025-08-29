import { SoilsDistribution } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";

type Props = {
  onNext: () => void;
  onBack: () => void;
  siteSoilsDistribution: SoilsDistribution;
  projectSoilsDistribution: SoilsDistribution;
};

const UrbanProjectSoilsSummary = ({
  onNext,
  onBack,
  siteSoilsDistribution,
  projectSoilsDistribution,
}: Props) => {
  return (
    <>
      <h2>Récapitulatif de l'occupation des sols</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        <div className="border border-solid border-borderGrey p-8">
          <h3 className="uppercase text-base">Site existant</h3>
          <SurfaceAreaPieChart
            soilsDistribution={siteSoilsDistribution}
            exportConfig={{
              title: "Récapitulatif de l'occupation des sols",
              subtitle: `Site existant`,
            }}
          />
        </div>
        <div className="border border-solid border-borderGrey p-8">
          <h3 className="uppercase text-base">Site avec projet</h3>
          <SurfaceAreaPieChart
            soilsDistribution={projectSoilsDistribution}
            exportConfig={{
              title: "Récapitulatif de l'occupation des sols",
              subtitle: `Site avec projet`,
            }}
          />
        </div>
      </div>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </>
  );
};

export default UrbanProjectSoilsSummary;
