import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import { EconomicBalanceByCategory } from "@/features/projects/core/projectImpactsEconomicBalance";
import { EnvironmentalImpactMetricsByListViewCategory } from "@/features/projects/core/projectImpactsEnvironmental";
import { SocialImpactMetricsByListViewCategory } from "@/features/projects/core/projectImpactsSocial";
import { SocioEconomicImpactsByBearerListView } from "@/features/projects/core/projectImpactsSocioEconomic";

import EconomicBalanceListSection from "./sections/EconomicBalance";
import EnvironmentalListSection from "./sections/EnvironmentalListSection";
import SocialListSection from "./sections/SocialListSection";
import SocioEconomicImpactsListSection from "./sections/SocioEconomicListSection";

type Props = {
  economicBalance: EconomicBalanceByCategory;
  socioEconomicImpacts: SocioEconomicImpactsByBearerListView;
  environmentImpacts: EnvironmentalImpactMetricsByListViewCategory;
  socialImpacts: SocialImpactMetricsByListViewCategory;
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

      {Object.values(environmentImpacts).flat().length > 0 && (
        <EnvironmentalListSection impacts={environmentImpacts} {...rest} />
      )}

      {Object.values(socialImpacts).flat().length > 0 && (
        <SocialListSection impacts={socialImpacts} {...rest} />
      )}
    </section>
  );
};

export default ImpactsListView;
