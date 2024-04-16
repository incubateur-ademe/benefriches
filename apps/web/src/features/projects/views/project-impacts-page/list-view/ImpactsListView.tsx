import { ReconversionProjectImpacts } from "../../../domain/impacts.types";
import { ImpactDescriptionModalCategory } from "../modals/ImpactDescriptionModalWizard";
import CostBenefitAnalysisListSection from "./sections/CostBenefitAnalysis";
import EconomicBalanceListSection from "./sections/EconomicBalance";
import EnvironmentalListSection from "./sections/Environmental";
import SocialListSection from "./sections/Social";
import SocioEconomicImpactsListSection from "./sections/socio-economic";

type Props = {
  project: {
    name: string;
  };
  impacts: ReconversionProjectImpacts;
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
  displayEnvironmentData: boolean;
  displaySocialData: boolean;
  displayEconomicData: boolean;
};

const ImpactsListView = ({
  impacts,
  displayEnvironmentData,
  displaySocialData,
  displayEconomicData,
  openImpactDescriptionModal,
}: Props) => {
  const displaySocioEconomicSection = displayEconomicData || displayEnvironmentData;

  return (
    <div className="tw-max-w-4xl tw-mx-auto">
      {displayEconomicData && (
        <>
          <CostBenefitAnalysisListSection
            openImpactDescriptionModal={openImpactDescriptionModal}
            economicBalanceImpactTotal={impacts.economicBalance.total}
            socioEconomicImpactTotal={impacts.socioeconomic.total}
          />
          <EconomicBalanceListSection
            openImpactDescriptionModal={openImpactDescriptionModal}
            impact={impacts.economicBalance}
          />
        </>
      )}

      {displaySocioEconomicSection && (
        <SocioEconomicImpactsListSection
          socioEconomicImpacts={impacts.socioeconomic.impacts}
          displayEnvironmentData={displayEnvironmentData}
          displayEconomicData={displayEconomicData}
          openImpactDescriptionModal={openImpactDescriptionModal}
        />
      )}

      {displayEnvironmentData && (
        <EnvironmentalListSection
          impacts={impacts}
          openImpactDescriptionModal={openImpactDescriptionModal}
        />
      )}

      {displaySocialData && (
        <SocialListSection
          openImpactDescriptionModal={openImpactDescriptionModal}
          impacts={impacts}
        />
      )}
    </div>
  );
};

export default ImpactsListView;
