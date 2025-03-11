import {
  EnvironmentalAreaChartImpactsData,
  SocialAreaChartImpactsData,
} from "@/features/projects/domain/projectImpactsAreaChartsData";
import { EconomicBalance } from "@/features/projects/domain/projectImpactsEconomicBalance";
import { SocioEconomicImpactByActor } from "@/features/projects/domain/projectImpactsSocioEconomic";

import ImpactsChartsEconomicSection from "./ImpactsChartsEconomicSection";
import ImpactAreaChartsSection from "./impacts/social-and-environment/ImpactAreaChartsSection";

type Props = {
  projectName: string;
  economicBalance: EconomicBalance;
  socioEconomicTotalImpact: number;
  socioEconomicImpactsByActor: SocioEconomicImpactByActor;
  environmentalAreaChartImpactsData: EnvironmentalAreaChartImpactsData;
  socialAreaChartImpactsData: SocialAreaChartImpactsData;
};

const ImpactsChartsView = ({
  economicBalance,
  socioEconomicTotalImpact,
  socioEconomicImpactsByActor,
  environmentalAreaChartImpactsData,
  socialAreaChartImpactsData,
}: Props) => {
  const displayEconomicBalance = economicBalance.economicBalance.length > 0;
  return (
    <div>
      {(displayEconomicBalance || socioEconomicImpactsByActor.length > 0) && (
        <ImpactsChartsEconomicSection
          economicBalance={economicBalance}
          socioEconomicTotalImpact={socioEconomicTotalImpact}
          socioEconomicImpactsByActor={socioEconomicImpactsByActor}
        />
      )}

      <ImpactAreaChartsSection
        environmentalAreaChartImpactsData={environmentalAreaChartImpactsData}
        socialAreaChartImpactsData={socialAreaChartImpactsData}
      />
    </div>
  );
};

export default ImpactsChartsView;
