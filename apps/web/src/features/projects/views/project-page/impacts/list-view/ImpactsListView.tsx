import { EconomicBalance } from "@/features/projects/domain/projectImpactsEconomicBalance";
import { EnvironmentalImpact } from "@/features/projects/domain/projectImpactsEnvironmental";
import { SocialImpact } from "@/features/projects/domain/projectImpactsSocial";
import { SocioEconomicDetailedImpact } from "@/features/projects/domain/projectImpactsSocioEconomic";

import { ModalDataProps } from "../impact-description-modals/ImpactModalDescription";
import EconomicBalanceListSection from "./sections/EconomicBalance";
import EnvironmentalListSection from "./sections/EnvironmentalListSection";
import SocialListSection from "./sections/SocialListSection";
import SocioEconomicImpactsListSection from "./sections/SocioEconomicListSection";

type Props = {
  economicBalance: EconomicBalance;
  socioEconomicImpacts: SocioEconomicDetailedImpact;
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
    <section className="tw-max-w-4xl tw-mx-auto tw-mt-10">
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
