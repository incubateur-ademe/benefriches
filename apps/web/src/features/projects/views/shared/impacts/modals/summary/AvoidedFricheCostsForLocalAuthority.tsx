import { useContext, useMemo } from "react";

import type { KeyImpactIndicatorData } from "@/features/projects/core/projectKeyImpactIndicators";
import { getSocioEconomicImpactLabel } from "@/features/projects/views/project-page/impacts/getImpactLabel";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import ImpactItemDetails from "../../../../project-page/impacts/list-view/ImpactItemDetails";
import ImpactItemGroup from "../../../../project-page/impacts/list-view/ImpactItemGroup";

type Props = {
  impactData: Extract<KeyImpactIndicatorData, { name: "avoidedFricheCostsForLocalAuthority" }>;
};

const listFormatter = new Intl.ListFormat("fr", {
  style: "long",
  type: "conjunction",
});

const SummaryAvoidedFricheCostsForLocalAuthorityDescription = ({ impactData }: Props) => {
  const { value, isSuccess } = impactData;

  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const title = isSuccess
    ? "- de dépenses de sécurisation\u00a0💰"
    : "Des dépenses de sécurisation demeurent\u00a0💸";

  const actorNames = useMemo(
    () =>
      listFormatter.format(
        value.details.map(
          (elem) =>
            elem.bearerName ??
            (elem.impactName === "avoidedFricheMaintenanceAndSecuringCostsForOwner"
              ? "l'actuel propriétaire"
              : "l'actuel locataire"),
        ),
      ),
    [value],
  );

  return (
    <ModalBody>
      <ModalHeader
        title={title}
        value={{
          text: formatMonetaryImpact(value.total),
          state: isSuccess ? "success" : "error",
          description: isSuccess
            ? `économisés par ${actorNames} grâce à la reconversion de la friche`
            : `toujours à la charge de ${actorNames}`,
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
              Ainsi, réaliser un projet sur des espaces natures, agricoles ou forestiers et non sur
              une friche ne permet pas de réduire ces dépenses !
            </p>
          </>
        )}

        {value.details.map((impact) => (
          <ImpactItemGroup isClickable key={`${impact.impactName}.${impact.bearerName}`}>
            <ImpactItemDetails
              impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
              value={impact.amount}
              actor={impact.bearerName}
              label={getSocioEconomicImpactLabel(impact.impactName)}
              type="monetary"
              labelProps={{
                onClick: (e) => {
                  e.stopPropagation();

                  updateModalContent({
                    sectionName: "socio_economic",
                    subSectionName: "localAuthority",
                    impactName: impact.impactName,
                  });
                },
              }}
            />
          </ImpactItemGroup>
        ))}
      </ModalContent>
    </ModalBody>
  );
};

export default SummaryAvoidedFricheCostsForLocalAuthorityDescription;
