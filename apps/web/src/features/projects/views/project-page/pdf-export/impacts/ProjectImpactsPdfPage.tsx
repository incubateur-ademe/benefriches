import { EconomicBalance } from "@/features/projects/domain/projectImpactsEconomicBalance";
import { EnvironmentalImpact } from "@/features/projects/domain/projectImpactsEnvironmental";
import { SocialImpact } from "@/features/projects/domain/projectImpactsSocial";
import { SocioEconomicDetailedImpact } from "@/features/projects/domain/projectImpactsSocioEconomic";

import EconomicBalancePages from "./EconomicBalancePages";
import EnvironmentalImpactsPage from "./environmental-impacts";
import SocialImpactsPage from "./social-impacts";
import SocioEconomicImpactsPages from "./socio-economic-impacts";

type Props = {
  impacts: {
    economicBalance: EconomicBalance;
    environment: EnvironmentalImpact[];
    socioEconomic: SocioEconomicDetailedImpact;
    social: SocialImpact[];
  };
  evaluationPeriodInYears: number;
  showEconomicBalance: boolean;
  showSocioEconomicImpacts: boolean;
  showSocialImpacts: boolean;
  showEnvironmentalImpacts: boolean;
};

export default function ProjectImpactsPdfPages({
  impacts,
  evaluationPeriodInYears,
  showEconomicBalance,
  showSocioEconomicImpacts,
  showSocialImpacts,
  showEnvironmentalImpacts,
}: Props) {
  return (
    <>
      {showEconomicBalance && (
        <EconomicBalancePages
          impact={impacts.economicBalance}
          evaluationPeriodInYears={evaluationPeriodInYears}
        />
      )}
      {showSocioEconomicImpacts && <SocioEconomicImpactsPages impacts={impacts.socioEconomic} />}
      {showSocialImpacts && <SocialImpactsPage impacts={impacts.social} />}
      {showEnvironmentalImpacts && <EnvironmentalImpactsPage impacts={impacts.environment} />}
    </>
  );
}
