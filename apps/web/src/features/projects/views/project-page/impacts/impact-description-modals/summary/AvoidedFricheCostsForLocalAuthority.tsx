import { useContext } from "react";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import ImpactItemDetails from "../../list-view/ImpactItemDetails";
import ImpactItemGroup from "../../list-view/ImpactItemGroup";
import { ImpactModalDescriptionContext } from "../ImpactModalDescriptionContext";
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
    <>
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
        <p>
          Un site qui reste en l'état, sans intervention, induit des coûts importants, à la charge
          de l'ancien locataire ou du propriétaire du terrain.
        </p>
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
    </>
  );
};

export default SummaryAvoidedFricheCostsForLocalAuthorityDescription;
