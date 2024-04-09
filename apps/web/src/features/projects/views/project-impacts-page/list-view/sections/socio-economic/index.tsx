import SocioEconomicDirectImpactsSection from "./EconomicDirect";
import SocioEconomicIndirectImpactsSection from "./EconomicIndirect";
import SocioEconomicEnvironmentalMonetaryImpactsSection from "./EnvironmentalMonetary";

import { ReconversionProjectImpacts } from "@/features/projects/domain/impacts.types";
import ImpactDetailLabel from "@/features/projects/views/project-impacts-page/list-view/ImpactDetailLabel";
import ImpactDetailRow from "@/features/projects/views/project-impacts-page/list-view/ImpactItemDetailRow";
import ImpactMainTitle from "@/features/projects/views/project-impacts-page/list-view/ImpactMainTitle";
import ImpactValue from "@/features/projects/views/project-impacts-page/list-view/ImpactValue";
import { ImpactDescriptionModalCategory } from "@/features/projects/views/project-impacts-page/modals/ImpactDescriptionModalWizard";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { getActorLabel } from "@/features/projects/views/shared/socioEconomicLabels";

type Props = {
  socioEconomicImpacts: ReconversionProjectImpacts["socioeconomic"]["impacts"];
  displayEnvironmentData: boolean;
  displayEconomicData: boolean;
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

type SocioEconomicImpactRowProps = {
  impact: Props["socioEconomicImpacts"][number];
};

export const SocioEconomicImpactRow = ({ impact }: SocioEconomicImpactRowProps) => {
  return (
    <ImpactDetailRow key={impact.actor + impact.amount}>
      <ImpactDetailLabel>{getActorLabel(impact.actor)}</ImpactDetailLabel>
      <ImpactValue>{formatMonetaryImpact(impact.amount)}</ImpactValue>
    </ImpactDetailRow>
  );
};

const SocioEconomicImpactsListSection = ({
  socioEconomicImpacts,
  displayEnvironmentData,
  displayEconomicData,
  openImpactDescriptionModal,
}: Props) => {
  return (
    <section className="fr-mb-5w">
      <ImpactMainTitle
        title="Impacts socio-économiques"
        onClick={() => {
          openImpactDescriptionModal("socio-economic");
        }}
      />
      {displayEconomicData && (
        <>
          <SocioEconomicDirectImpactsSection
            socioEconomicImpacts={socioEconomicImpacts}
            openImpactDescriptionModal={openImpactDescriptionModal}
          />

          <SocioEconomicIndirectImpactsSection socioEconomicImpacts={socioEconomicImpacts} />
        </>
      )}

      {displayEnvironmentData && (
        <SocioEconomicEnvironmentalMonetaryImpactsSection
          socioEconomicImpacts={socioEconomicImpacts}
          openImpactDescriptionModal={openImpactDescriptionModal}
        />
      )}
    </section>
  );
};

export default SocioEconomicImpactsListSection;
