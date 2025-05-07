import { SocioEconomicDetailedImpact } from "@/features/projects/domain/projectImpactsSocioEconomic";

import ImpactModalDescription, {
  ModalDataProps,
} from "../../impact-description-modals/ImpactModalDescription";
import ImpactSection from "../ImpactSection";
import SocioEconomicImpactSection from "./SocioEconomicImpactSection";

type Props = {
  socioEconomicImpacts: SocioEconomicDetailedImpact;
  modalData: ModalDataProps;
};

const SocioEconomicImpactsListSection = ({ socioEconomicImpacts, modalData }: Props) => {
  const { economicDirect, economicIndirect, environmentalMonetary, socialMonetary, total } =
    socioEconomicImpacts;

  return (
    <>
      <ImpactModalDescription
        dialogId={`fr-modal-impacts-socio_economic-List`}
        initialState={{ sectionName: "socio_economic" }}
        {...modalData}
      />
      <ImpactSection
        title="Impacts socio-économiques"
        isMain
        total={total}
        initialShowSectionContent={false}
        dialogId={`fr-modal-impacts-socio_economic-List`}
      >
        <SocioEconomicImpactSection
          sectionName="economic_direct"
          modalData={modalData}
          {...economicDirect}
        />
        <SocioEconomicImpactSection
          sectionName="economic_indirect"
          modalData={modalData}
          {...economicIndirect}
        />
        <SocioEconomicImpactSection
          sectionName="social_monetary"
          modalData={modalData}
          {...socialMonetary}
        />
        <SocioEconomicImpactSection
          modalData={modalData}
          sectionName="environmental_monetary"
          {...environmentalMonetary}
        />
      </ImpactSection>
    </>
  );
};

export default SocioEconomicImpactsListSection;
