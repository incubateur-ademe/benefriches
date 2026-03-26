import { useContext } from "react";

import type { KeyImpactIndicatorData } from "@/features/projects/domain/projectKeyImpactIndicators";
import ImpactItemDetails from "@/features/projects/views/project-page/impacts/list-view/ImpactItemDetails";
import ImpactItemGroup from "@/features/projects/views/project-page/impacts/list-view/ImpactItemGroup";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import { ImpactModalDescriptionContext } from "../ImpactModalDescriptionContext";

type Props = {
  impactData: Extract<KeyImpactIndicatorData, { name: "avoidedMaintenanceCostsForLocalAuthority" }>;
};

const SummaryAvoidedMaintenanceCostsForLocalAuthorityDescription = ({ impactData }: Props) => {
  const { value, isSuccess } = impactData;

  const title = isSuccess
    ? "✅ Des dépenses de fonctionnement à la charge de la collectivité réduites"
    : "🚨 Des dépenses de fonctionnement à la charge de la collectivité maintenues ";

  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  return (
    <ModalBody>
      <ModalHeader
        title={title}
        value={{
          text: formatMonetaryImpact(value.amount),
          state: isSuccess ? "success" : "error",
          description: isSuccess
            ? `économisés par la collectivité grâce à la reconversion de la friche`
            : `toujours à la charge de la collectivité`,
        }}
        breadcrumbSegments={[{ label: "Synthèse" }, { label: title }]}
      />
      <ModalContent noTitle>
        {isSuccess ? (
          <>
            <p>
              Un site qui reste en l'état, sans intervention, induit des coûts importants, à la
              charge de l'ancien exploitant du site ou du propriétaire du terrain. En effet, lorsque
              ces derniers sont défaillants, ou que le site soit sous la responsabilité d’un
              liquidateur, c’est souvent la commune qui se substitue à eux pour éviter les
              dégradations ou intrusions et ainsi réduire les risques d’accidents et la perte de
              valeur du site / terrain.
            </p>
            <p>
              Par ailleurs, un projet sur friche est généralement plus compact que le même projet
              réalisé sur des espaces agricoles, naturels ou forestiers, ce qui permet d’économiser
              dans l’entretien des VRD.
            </p>
            <p>Ainsi, reconvertir une friche permet d’économiser ces dépenses !</p>
          </>
        ) : (
          <>
            <p>
              Un site qui reste en l'état, sans intervention, induit des coûts importants, à la
              charge de l'ancien exploitant du site ou du propriétaire du terrain. En effet, lorsque
              ces derniers sont défaillants, ou que le site soit sous la responsabilité d’un
              liquidateur, c’est souvent la commune qui se substitue à eux pour éviter les
              dégradations ou intrusions et ainsi réduire les risques d’accidents et la perte de
              valeur du site / terrain.
            </p>
            <p>
              Par ailleurs, un projet sur espaces agricoles, naturels ou forestiers friche est
              généralement moins compact que le même projet réalisé sur friche, ce qui conduit à des
              frais d’entretien des VRD accrus.
            </p>
            <p>Ainsi, conserver un site en friche maintient ces dépenses&nbsp;!</p>
          </>
        )}

        {impactData.value.avoidedFricheCosts && (
          <ImpactItemGroup>
            <ImpactItemDetails
              impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
              value={impactData.value.avoidedFricheCosts}
              label="🏚️ Dépenses de sécurisation de la friche évitées"
              type="monetary"
              labelProps={{
                onClick: (e) => {
                  e.stopPropagation();
                  updateModalContent({
                    sectionName: "socio_economic",
                    impactName: "avoided_friche_costs",
                  });
                },
              }}
            />
          </ImpactItemGroup>
        )}
        {impactData.value.avoidedRoadAndUtilitiesMaintenance && (
          <ImpactItemGroup>
            <ImpactItemDetails
              impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
              value={impactData.value.avoidedRoadAndUtilitiesMaintenance}
              label="🅿️ Dépenses d’entretien des VRD évités"
              type="monetary"
              labelProps={{
                onClick: (e) => {
                  e.stopPropagation();
                  updateModalContent({
                    sectionName: "socio_economic",
                    impactName: "roads_and_utilities_maintenance_expenses",
                  });
                },
              }}
            />
          </ImpactItemGroup>
        )}
        {impactData.value.fricheCosts && (
          <ImpactItemGroup>
            <ImpactItemDetails
              value={impactData.value.fricheCosts}
              label="🏚️ Dépenses de gestion et sécurisation de la friche"
              type="monetary"
              labelProps={{
                onClick: (e) => {
                  e.stopPropagation();
                  updateModalContent({
                    sectionName: "socio_economic",
                    impactName: "avoided_friche_costs",
                  });
                },
              }}
            />
          </ImpactItemGroup>
        )}
        {impactData.value.roadAndUtilitiesMaintenance && (
          <ImpactItemGroup>
            <ImpactItemDetails
              value={impactData.value.roadAndUtilitiesMaintenance}
              label="🅿️ Dépenses d’entretien des VRD supplémentaires"
              type="monetary"
              labelProps={{
                onClick: (e) => {
                  e.stopPropagation();
                  updateModalContent({
                    sectionName: "socio_economic",
                    impactName: "roads_and_utilities_maintenance_expenses",
                  });
                },
              }}
            />
          </ImpactItemGroup>
        )}
      </ModalContent>
    </ModalBody>
  );
};

export default SummaryAvoidedMaintenanceCostsForLocalAuthorityDescription;
