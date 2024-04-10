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
import { formatDefaultImpact } from "@/features/projects/views/shared/formatImpactValue";

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
          <ImpactValue isTotal>
            {formatDefaultImpact(impacts.fullTimeJobs.forecast - impacts.fullTimeJobs.current)}
          </ImpactValue>
        </div>
        <ImpactDetailRow>
          <ImpactDetailLabel>👷 Reconversion du site</ImpactDetailLabel>
          <ImpactValue>
            {formatDefaultImpact(
              impacts.fullTimeJobs.conversion.forecast - impacts.fullTimeJobs.conversion.current,
            )}
          </ImpactValue>
        </ImpactDetailRow>
        <ImpactDetailRow>
          <ImpactDetailLabel>🧑‍🔧 Exploitation du site</ImpactDetailLabel>
          <ImpactValue>
            {formatDefaultImpact(
              impacts.fullTimeJobs.operations.forecast - impacts.fullTimeJobs.operations.current,
            )}
          </ImpactValue>
        </ImpactDetailRow>
      </ImpactItemGroup>

      {impacts.accidents && (
        <>
          <ImpactSectionTitle>Impacts sur les riverains</ImpactSectionTitle>
          <ImpactItemGroup>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <ImpactLabel>🤕 Accidents évités sur la friche</ImpactLabel>
              <ImpactValue isTotal>
                {formatDefaultImpact(impacts.accidents.current, { withSignPrefix: false })}
              </ImpactValue>
            </div>
            <ImpactDetailRow>
              <ImpactDetailLabel>💥 Blessés légers évités</ImpactDetailLabel>
              <ImpactValue>
                {formatDefaultImpact(impacts.accidents.minorInjuries.current, {
                  withSignPrefix: false,
                })}
              </ImpactValue>
            </ImpactDetailRow>
            <ImpactDetailRow>
              <ImpactDetailLabel>🚑 Blessés graves évités</ImpactDetailLabel>
              <ImpactValue>
                {formatDefaultImpact(impacts.accidents.severeInjuries.current, {
                  withSignPrefix: false,
                })}
              </ImpactValue>
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
            <ImpactValue isTotal>
              {formatDefaultImpact(impacts.householdsPoweredByRenewableEnergy.forecast, {
                withSignPrefix: false,
              })}
            </ImpactValue>
          </ImpactItemRow>
        </>
      )}
    </section>
  );
};

export default SocialListSection;
