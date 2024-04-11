import ImpactDetailLabel from "../ImpactDetailLabel";
import ImpactDetailRow from "../ImpactItemDetailRow";
import ImpactItemGroup from "../ImpactItemGroup";
import ImpactItemRow from "../ImpactItemRow";
import ImpactLabel from "../ImpactLabel";
import ImpactMainTitle from "../ImpactMainTitle";
import ImpactSectionTitle from "../ImpactSectionTitle";
import ImpactValue from "../ImpactValue";

import { ReconversionProjectImpacts } from "@/features/projects/domain/impacts.types";
import { ImpactDescriptionModalCategory } from "@/features/projects/views/project-impacts-page/modals/ImpactDescriptionModalWizard";

type Props = {
  impacts: ReconversionProjectImpacts;
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const SocialListSection = ({ impacts, openImpactDescriptionModal }: Props) => {
  return (
    <section>
      <ImpactMainTitle
        title="Impacts sociaux"
        onClick={() => {
          openImpactDescriptionModal("social");
        }}
      />
      <ImpactSectionTitle>Impacts sur l'emploi</ImpactSectionTitle>
      <ImpactItemGroup>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <ImpactLabel>🧑‍🔧 Emplois équivalent temps plein mobilisés</ImpactLabel>
          <ImpactValue
            isTotal
            value={impacts.fullTimeJobs.forecast - impacts.fullTimeJobs.current}
          />
        </div>
        <ImpactDetailRow>
          <ImpactDetailLabel>👷 Reconversion du site</ImpactDetailLabel>
          <ImpactValue
            value={
              impacts.fullTimeJobs.conversion.forecast - impacts.fullTimeJobs.conversion.current
            }
          />
        </ImpactDetailRow>
        <ImpactDetailRow>
          <ImpactDetailLabel>🧑‍🔧 Exploitation du site</ImpactDetailLabel>
          <ImpactValue
            value={
              impacts.fullTimeJobs.operations.forecast - impacts.fullTimeJobs.operations.current
            }
          />
        </ImpactDetailRow>
      </ImpactItemGroup>

      {impacts.accidents && (
        <>
          <ImpactSectionTitle>Impacts sur les riverains</ImpactSectionTitle>
          <ImpactItemGroup>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <ImpactLabel>🤕 Accidents évités sur la friche</ImpactLabel>
              <ImpactValue isTotal value={impacts.accidents.current} />
            </div>
            <ImpactDetailRow>
              <ImpactDetailLabel>💥 Blessés légers évités</ImpactDetailLabel>
              <ImpactValue value={impacts.accidents.minorInjuries.current} />
            </ImpactDetailRow>
            <ImpactDetailRow>
              <ImpactDetailLabel>🚑 Blessés graves évités</ImpactDetailLabel>
              <ImpactValue value={impacts.accidents.severeInjuries.current} />
            </ImpactDetailRow>
          </ImpactItemGroup>
        </>
      )}
      {impacts.householdsPoweredByRenewableEnergy && (
        <>
          <ImpactSectionTitle>Impacts sur la société française</ImpactSectionTitle>
          <ImpactItemRow
            onClick={() => {
              openImpactDescriptionModal("social-households-powered-by-renewable-energy");
            }}
          >
            <ImpactLabel>🏠 Foyers alimentés par les EnR</ImpactLabel>
            <ImpactValue isTotal value={impacts.householdsPoweredByRenewableEnergy.forecast} />
          </ImpactItemRow>
        </>
      )}
    </section>
  );
};

export default SocialListSection;
