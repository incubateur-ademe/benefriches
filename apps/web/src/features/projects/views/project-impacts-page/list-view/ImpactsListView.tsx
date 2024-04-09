import { ReconversionProjectImpacts } from "../../../domain/impacts.types";
import { ImpactDescriptionModalCategory } from "../modals/ImpactDescriptionModalWizard";
import CostBenefitAnalysisListSection from "./sections/CostBenefitAnalysis";
import EconomicBalanceListSection from "./sections/EconomicBalance";
import EnvironmentalListSection from "./sections/Environmental";
import SocialListSection from "./sections/Social";
import SocioEconomicImpactsListSection from "./sections/SocioEconomic";

type Props = {
  project: {
    name: string;
  };
  impacts: ReconversionProjectImpacts;
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const ImpactsListView = ({ impacts, openImpactDescriptionModal }: Props) => {
  return (
    <div style={{ maxWidth: "900px", margin: "auto" }}>
      <CostBenefitAnalysisListSection
        openImpactDescriptionModal={openImpactDescriptionModal}
        economicBalanceImpactTotal={impacts.economicBalance.total}
        socioEconomicImpactTotal={impacts.socioeconomic.total}
      />
      <EconomicBalanceListSection
        openImpactDescriptionModal={openImpactDescriptionModal}
        impact={impacts.economicBalance}
      />
      <SocioEconomicImpactsListSection
        socioEconomicImpacts={impacts.socioeconomic.impacts}
        openImpactDescriptionModal={openImpactDescriptionModal}
      />
      <EnvironmentalListSection
        impacts={impacts}
        openImpactDescriptionModal={openImpactDescriptionModal}
      />
      <SocialListSection
        openImpactDescriptionModal={openImpactDescriptionModal}
        impacts={impacts}
      />
    </div>
  );
};

export default ImpactsListView;
