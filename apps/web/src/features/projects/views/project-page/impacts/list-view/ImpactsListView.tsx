import { EconomicBalance } from "@/features/projects/domain/projectImpactsEconomicBalance";
import { EnvironmentalImpact } from "@/features/projects/domain/projectImpactsEnvironmental";
import { SocialImpact } from "@/features/projects/domain/projectImpactsSocial";
import { SocioEconomicDetailedImpact } from "@/features/projects/domain/projectImpactsSocioEconomic";

import EconomicBalanceListSection from "./sections/EconomicBalance";
import EnvironmentalListSection from "./sections/EnvironmentalListSection";
import SocialListSection from "./sections/SocialListSection";
import SocioEconomicImpactsListSection from "./sections/SocioEconomicListSection";

type Props = {
  economicBalance: EconomicBalance;
  socioEconomicImpacts: SocioEconomicDetailedImpact;
  environmentImpacts: EnvironmentalImpact[];
  socialImpacts: SocialImpact[];
};

const ImpactsListView = ({
  economicBalance,
  socioEconomicImpacts,
  environmentImpacts,
  socialImpacts,
}: Props) => {
  return (
    <div className="tw-max-w-4xl tw-mx-auto tw-pb-8">
      {economicBalance.economicBalance.length !== 0 && (
        <EconomicBalanceListSection impact={economicBalance} />
      )}

      {socioEconomicImpacts.total !== 0 && (
        <SocioEconomicImpactsListSection socioEconomicImpacts={socioEconomicImpacts} />
      )}

      {environmentImpacts.length > 0 && <EnvironmentalListSection impacts={environmentImpacts} />}

      {socialImpacts.length > 0 && <SocialListSection impacts={socialImpacts} />}
    </div>
  );
};

export default ImpactsListView;
