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
};

export default function ProjectImpactsPdfPages({ impacts }: Props) {
  return (
    <>
      <EconomicBalancePages impact={impacts.economicBalance} />
      <SocioEconomicImpactsPages impacts={impacts.socioEconomic} />
      <SocialImpactsPage impacts={impacts.social} />
      <EnvironmentalImpactsPage impacts={impacts.environment} />
    </>
  );
}
