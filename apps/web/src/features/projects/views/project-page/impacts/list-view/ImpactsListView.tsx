import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import { EconomicBalance } from "@/features/projects/core/projectImpactsEconomicBalance";
import { EnvironmentalImpact } from "@/features/projects/core/projectImpactsEnvironmental";
import { SocialImpact } from "@/features/projects/core/projectImpactsSocial";
import { SocioEconomicImpactsByBearerListView } from "@/features/projects/core/projectImpactsSocioEconomic";

import EconomicBalanceListSection from "./sections/EconomicBalance";
import EnvironmentalListSection from "./sections/EnvironmentalListSection";
import SocialListSection from "./sections/SocialListSection";
import SocioEconomicImpactsListSection from "./sections/SocioEconomicListSection";

type Props = {
  economicBalance: EconomicBalance;
  socioEconomicImpacts: SocioEconomicImpactsByBearerListView;
  environmentImpacts: EnvironmentalImpact[];
  socialImpacts: SocialImpact[];
  modalData: ModalDataProps;
};

const ImpactsListView = ({
  economicBalance,
  socioEconomicImpacts,
  environmentImpacts,
  socialImpacts,
  ...rest
}: Props) => {
  return (
    <section className="max-w-4xl mx-auto mt-10">
      {economicBalance.economicBalance.length !== 0 && (
        <EconomicBalanceListSection impact={economicBalance} {...rest} />
      )}

      {socioEconomicImpacts.total !== 0 && (
        <SocioEconomicImpactsListSection socioEconomicImpacts={socioEconomicImpacts} {...rest} />
      )}

      {environmentImpacts.length > 0 && (
        <EnvironmentalListSection impacts={environmentImpacts} {...rest} />
      )}

      {socialImpacts.length > 0 && <SocialListSection impacts={socialImpacts} {...rest} />}
    </section>
  );
};

export default ImpactsListView;
