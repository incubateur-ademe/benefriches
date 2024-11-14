import { EconomicBalance } from "@/features/projects/domain/projectImpactsEconomicBalance";
import { EnvironmentalImpact } from "@/features/projects/domain/projectImpactsEnvironmental";
import { SocialImpact } from "@/features/projects/domain/projectImpactsSocial";
import { SocioEconomicImpactByActor } from "@/features/projects/domain/projectImpactsSocioEconomic";

import { ImpactDescriptionModalCategory } from "../impact-description-modals/ImpactDescriptionModalWizard";
import ImpactsChartsEconomicSection from "./ImpactsChartsEconomicSection";
import ImpactsChartsEnvironmentSection from "./ImpactsChartsEnvironmentSection";
import ImpactsChartsSocialSection from "./ImpactsChartsSocialSection";

type Props = {
  projectName: string;
  economicBalance: EconomicBalance;
  socioEconomicImpacts: SocioEconomicImpactByActor;
  environmentImpacts: EnvironmentalImpact[];
  socialImpacts: SocialImpact[];
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const ImpactsChartsView = ({
  projectName,
  economicBalance,
  socioEconomicImpacts,
  environmentImpacts,
  socialImpacts,
  openImpactDescriptionModal,
}: Props) => {
  const displayEconomicBalance = economicBalance.economicBalance.length > 0;

  return (
    <div>
      {(displayEconomicBalance || socioEconomicImpacts.length > 0) && (
        <ImpactsChartsEconomicSection
          openImpactDescriptionModal={openImpactDescriptionModal}
          economicBalance={economicBalance}
          socioEconomicImpacts={socioEconomicImpacts}
        />
      )}
      {socialImpacts.length > 0 && (
        <ImpactsChartsSocialSection
          openImpactDescriptionModal={openImpactDescriptionModal}
          impacts={socialImpacts}
          projectName={projectName}
        />
      )}
      {environmentImpacts.length > 0 && (
        <ImpactsChartsEnvironmentSection
          openImpactDescriptionModal={openImpactDescriptionModal}
          impacts={environmentImpacts}
          projectName={projectName}
        />
      )}
    </div>
  );
};

export default ImpactsChartsView;
