import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import { breadcrumbSegments } from "./breadcrumbSegments";

type Props = {
  impactData?: number;
};
const AvoidedOtherSecuringCostsDescription = ({ impactData }: Props) => {
  return (
    <ModalBody size="medium">
      <ModalHeader
        title="🛡 Autres dépenses de sécurisation"
        value={
          impactData
            ? {
                state: impactData > 0 ? "success" : "error",
                text: formatMonetaryImpact(impactData),
                description: "pour l'actuel locataire ou le propriétaire",
              }
            : undefined
        }
        breadcrumbSegments={[...breadcrumbSegments, { label: "Autres dépenses de sécurisation" }]}
      />
      <ModalContent>
        <p>
          En plus des dépenses d’entretien, de débarras de dépôts sauvages ou de gardiennage,
          d’autres dépenses peuvent être nécessaires, par exemple pour la réparation de dommages non
          couverts par les assureurs (ex : incendie, réparation de clôture, portail ou dispositifs
          de fermeture).
        </p>
        <p>
          <strong>Bénéficiaire</strong> : actuel exploitant
        </p>

        <p>Les données du site ont été saisies par l’utilisateur·ice.</p>
      </ModalContent>
    </ModalBody>
  );
};

export default AvoidedOtherSecuringCostsDescription;
