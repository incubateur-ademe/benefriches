import { ImpactDescriptionModalCategory } from "../impact-description-modals/ImpactDescriptionModalWizard";
import ImpactsChartsEconomicSection from "./ImpactsChartsEconomicSection";
import ImpactsChartsEnvironmentSection from "./ImpactsChartsEnvironmentSection";
import ImpactsChartsSocialSection from "./ImpactsChartsSocialSection";

import { EconomicBalance } from "@/features/projects/application/projectImpactsEconomicBalance.selectors";
import { EnvironmentalImpact } from "@/features/projects/application/projectImpactsEnvironmental.selectors";
import { SocialImpact } from "@/features/projects/application/projectImpactsSocial.selectors";
import { SocioEconomicImpactByActorAndCategory } from "@/features/projects/application/projectImpactsSocioEconomic.selectors";

type Props = {
  projectName: string;
  economicBalance: EconomicBalance;
  socioEconomicImpacts: SocioEconomicImpactByActorAndCategory;
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
      {(displayEconomicBalance || socioEconomicImpacts.total !== 0) && (
        <ImpactsChartsEconomicSection
          openImpactDescriptionModal={openImpactDescriptionModal}
          economicBalance={economicBalance}
          socioEconomicImpacts={socioEconomicImpacts}
        />
      )}

      {environmentImpacts.length > 0 && (
        <ImpactsChartsEnvironmentSection
          openImpactDescriptionModal={openImpactDescriptionModal}
          impacts={environmentImpacts}
          projectName={projectName}
        />
      )}

      {socialImpacts.length > 0 && (
        <ImpactsChartsSocialSection
          openImpactDescriptionModal={openImpactDescriptionModal}
          impacts={socialImpacts}
          projectName={projectName}
        />
      )}
    </div>
  );
};

export default ImpactsChartsView;
