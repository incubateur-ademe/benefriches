import { EconomicBalance } from "@/features/projects/application/projectImpactsEconomicBalance.selectors";
import { EnvironmentalImpact } from "@/features/projects/application/projectImpactsEnvironmental.selectors";
import { SocialImpact } from "@/features/projects/application/projectImpactsSocial.selectors";
import { SocioEconomicDetailedImpact } from "@/features/projects/application/projectImpactsSocioEconomic.selectors";

import { ImpactDescriptionModalCategory } from "../impact-description-modals/ImpactDescriptionModalWizard";
import EconomicBalanceListSection from "./sections/EconomicBalance";
import EnvironmentalListSection from "./sections/EnvironmentalListSection";
import SocialListSection from "./sections/SocialListSection";
import SocioEconomicImpactsListSection from "./sections/SocioEconomicListSection";

type Props = {
  economicBalance: EconomicBalance;
  socioEconomicImpacts: SocioEconomicDetailedImpact;
  environmentImpacts: EnvironmentalImpact[];
  socialImpacts: SocialImpact[];
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const ImpactsListView = ({
  economicBalance,
  socioEconomicImpacts,
  environmentImpacts,
  socialImpacts,
  openImpactDescriptionModal,
}: Props) => {
  return (
    <div className="tw-max-w-4xl tw-mx-auto tw-pb-8">
      {economicBalance.economicBalance.length !== 0 && (
        <EconomicBalanceListSection
          openImpactDescriptionModal={openImpactDescriptionModal}
          impact={economicBalance}
        />
      )}

      {socioEconomicImpacts.total !== 0 && (
        <SocioEconomicImpactsListSection
          socioEconomicImpacts={socioEconomicImpacts}
          openImpactDescriptionModal={openImpactDescriptionModal}
        />
      )}

      {environmentImpacts.length > 0 && (
        <EnvironmentalListSection
          impacts={environmentImpacts}
          openImpactDescriptionModal={openImpactDescriptionModal}
        />
      )}

      {socialImpacts.length > 0 && (
        <SocialListSection
          openImpactDescriptionModal={openImpactDescriptionModal}
          impacts={socialImpacts}
        />
      )}
    </div>
  );
};

export default ImpactsListView;
