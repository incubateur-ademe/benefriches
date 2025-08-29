import {
  EnvironmentalAreaChartImpactsData,
  SocialAreaChartImpactsData,
} from "@/features/projects/domain/projectImpactsAreaChartsData";
import { EconomicBalance } from "@/features/projects/domain/projectImpactsEconomicBalance";
import { SocioEconomicImpactByActor } from "@/features/projects/domain/projectImpactsSocioEconomic";

import { ModalDataProps } from "../impact-description-modals/ImpactModalDescription";
import CostBenefitAnalysisChartCard from "./impacts/cost-benefit-analysis/CostBenefitAnalysisChartCard";
import EconomicBalanceChartCard from "./impacts/economic-balance/EconomicBalanceChartCard";
import ImpactAreaChartsSection from "./impacts/social-and-environment/ImpactAreaChartsSection";
import SocioEconomicChartCard from "./impacts/socio-economic/SocioEconomicImpactsChartCard";

type Props = {
  projectName: string;
  economicBalance: EconomicBalance;
  socioEconomicTotalImpact: number;
  socioEconomicImpactsByActor: SocioEconomicImpactByActor;
  environmentalAreaChartImpactsData: EnvironmentalAreaChartImpactsData;
  socialAreaChartImpactsData: SocialAreaChartImpactsData;
  modalData: ModalDataProps;
};

const ImpactsChartsView = ({
  economicBalance,
  socioEconomicTotalImpact,
  socioEconomicImpactsByActor,
  environmentalAreaChartImpactsData,
  socialAreaChartImpactsData,
  modalData,
}: Props) => {
  const displayEconomicBalance = economicBalance.economicBalance.length > 0;
  return (
    <section className="mt-10 flex flex-col gap-8">
      {(displayEconomicBalance || socioEconomicImpactsByActor.length > 0) && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayEconomicBalance && (
              <CostBenefitAnalysisChartCard
                economicBalanceTotal={economicBalance.total}
                socioEconomicTotalImpact={socioEconomicTotalImpact}
                modalData={modalData}
              />
            )}
            {displayEconomicBalance && (
              <EconomicBalanceChartCard
                economicBalance={economicBalance["economicBalance"]}
                bearer={economicBalance["bearer"]}
                modalData={modalData}
              />
            )}
          </div>
          <SocioEconomicChartCard
            socioEconomicImpacts={socioEconomicImpactsByActor}
            modalData={modalData}
          />
        </>
      )}

      <ImpactAreaChartsSection
        modalData={modalData}
        environmentalAreaChartImpactsData={environmentalAreaChartImpactsData}
        socialAreaChartImpactsData={socialAreaChartImpactsData}
      />
    </section>
  );
};

export default ImpactsChartsView;
