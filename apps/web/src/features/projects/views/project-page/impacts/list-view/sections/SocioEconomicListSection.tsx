import { fr } from "@codegouvfr/react-dsfr";

import { SocioEconomicDetailedImpact } from "@/features/projects/domain/projectImpactsSocioEconomic";

import ImpactModalDescriptionProviderContainer from "../../impact-description-modals";
import { ImpactModalDescriptionContext } from "../../impact-description-modals/ImpactModalDescriptionContext";
import ImpactSection from "../ImpactSection";
import SocioEconomicImpactSection from "./SocioEconomicImpactSection";

type Props = {
  socioEconomicImpacts: SocioEconomicDetailedImpact;
};

const SocioEconomicImpactsListSection = ({ socioEconomicImpacts }: Props) => {
  const { economicDirect, economicIndirect, environmentalMonetary, socialMonetary, total } =
    socioEconomicImpacts;

  return (
    <ImpactModalDescriptionProviderContainer dialogId={`socio_economic_list`}>
      <ImpactModalDescriptionContext.Consumer>
        {({ openImpactModalDescription, dialogId }) => (
          <>
            <button
              aria-hidden="true"
              className={fr.cx("fr-hidden")}
              id={`${dialogId}-controlButton`}
              aria-controls={dialogId}
              data-fr-opened="false"
            ></button>
            <ImpactSection
              title="Impacts socio-économiques"
              isMain
              total={total}
              initialShowSectionContent={false}
              onTitleClick={() => {
                document.getElementById(`${dialogId}-controlButton`)?.click();
                openImpactModalDescription({ sectionName: "socio_economic" });
              }}
            >
              <SocioEconomicImpactSection sectionName="economic_direct" {...economicDirect} />
              <SocioEconomicImpactSection sectionName="economic_indirect" {...economicIndirect} />
              <SocioEconomicImpactSection sectionName="social_monetary" {...socialMonetary} />
              <SocioEconomicImpactSection
                sectionName="environmental_monetary"
                {...environmentalMonetary}
              />
            </ImpactSection>
          </>
        )}
      </ImpactModalDescriptionContext.Consumer>
    </ImpactModalDescriptionProviderContainer>
  );
};

export default SocioEconomicImpactsListSection;
