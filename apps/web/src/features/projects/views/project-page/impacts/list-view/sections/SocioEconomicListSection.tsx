import { SocioEconomicImpactsByBearerListView } from "@/features/projects/domain/projectImpactsSocioEconomic";

import ImpactModalDescription, {
  ModalDataProps,
} from "../../impact-description-modals/ImpactModalDescription";
import ImpactSection from "../ImpactSection";
import SocioEconomicImpactSection from "./SocioEconomicImpactSection";

type Props = {
  socioEconomicImpacts: SocioEconomicImpactsByBearerListView;
  modalData: ModalDataProps;
};

const SocioEconomicImpactsListSection = ({ socioEconomicImpacts, modalData }: Props) => {
  const { total } = socioEconomicImpacts;

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
          sectionName="localAuthority"
          modalData={modalData}
          impacts={socioEconomicImpacts}
        />
        <SocioEconomicImpactSection
          sectionName="localPeopleOrCompany"
          modalData={modalData}
          impacts={socioEconomicImpacts}
        />
        <SocioEconomicImpactSection
          sectionName="humanity"
          modalData={modalData}
          impacts={socioEconomicImpacts}
        />
      </ImpactSection>
    </>
  );
};

export default SocioEconomicImpactsListSection;
