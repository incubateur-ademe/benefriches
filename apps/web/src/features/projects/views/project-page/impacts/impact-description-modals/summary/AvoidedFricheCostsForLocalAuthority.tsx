import { useContext } from "react";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import ImpactItemDetails from "../../list-view/ImpactItemDetails";
import ImpactItemGroup from "../../list-view/ImpactItemGroup";
import { ImpactModalDescriptionContext } from "../ImpactModalDescriptionContext";
import ModalBody from "../shared/ModalBody";
import ModalContent from "../shared/ModalContent";
import ModalHeader from "../shared/ModalHeader";

type Props = {
  impactData: {
    isSuccess: boolean;
    value: {
      actorName: string;
      amount: number;
    };
  };
};

const SummaryAvoidedFricheCostsForLocalAuthorityDescription = ({ impactData }: Props) => {
  const { value, isSuccess } = impactData;
  const { amount, actorName } = value;

  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  const title = isSuccess
    ? "- de dépenses de sécurisation\u00a0💰"
    : "Des dépenses de sécurisation demeurent\u00a0💸";

  return (
    <ModalBody>
      <ModalHeader
        title={title}
        value={{
          text: formatMonetaryImpact(amount),
          state: isSuccess ? "success" : "error",
          description: isSuccess
            ? `économisés par ${actorName} grâce à la reconversion de la friche`
            : `toujours à la charge de ${actorName}`,
        }}
        breadcrumbSegments={[{ label: "Synthèse" }, { label: title }]}
      />
      <ModalContent>
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

        <ImpactItemGroup isClickable>
          <ImpactItemDetails
            impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
            value={amount}
            label="🏚 Dépenses de gestion et de sécurisation de la friche évitées"
            type="monetary"
            onClick={() => {
              openImpactModalDescription({
                sectionName: "socio_economic",
                impactName: "avoided_friche_costs",
              });
            }}
          />
        </ImpactItemGroup>
      </ModalContent>
    </ModalBody>
  );
};

export default SummaryAvoidedFricheCostsForLocalAuthorityDescription;
