import { AvoidedFricheCostsIndirectEconomicImpactItemView } from "shared";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { SocioEconomicSubSectionName } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import { getBreadcrumbSegments } from "./breadcrumbSegments";

type Props = {
  impactData?: number;
  bearerName: string;
  sectionName: SocioEconomicSubSectionName;
  impactName: AvoidedFricheCostsIndirectEconomicImpactItemView["name"];
};
const AvoidedOtherSecuringCostsDescription = ({
  impactData,
  bearerName,
  sectionName,
  impactName,
}: Props) => {
  return (
    <ModalBody size="medium">
      <ModalHeader
        title="🛡 Autres dépenses de sécurisation"
        value={
          impactData
            ? {
                state: impactData > 0 ? "success" : "error",
                text: formatMonetaryImpact(impactData),
                description: `pour ${bearerName}`,
              }
            : undefined
        }
        breadcrumbSegments={[
          ...getBreadcrumbSegments(sectionName, impactName),
          { label: "Autres dépenses de sécurisation" },
        ]}
      />
      <ModalContent>
        <p>
          En plus des dépenses d’entretien, de débarras de dépôts sauvages ou de gardiennage,
          d’autres dépenses peuvent être nécessaires, par exemple pour la réparation de dommages non
          couverts par les assureurs (ex : incendie, réparation de clôture, portail ou dispositifs
          de fermeture).
        </p>
        <p>
          <strong>Bénéficiaire</strong> :{" "}
          {impactName === "avoidedFricheMaintenanceAndSecuringCostsForOwner"
            ? "actuel propriétaire"
            : "actuel locataire"}
        </p>

        <p>Les données du site ont été saisies par l’utilisateur·ice.</p>
      </ModalContent>
    </ModalBody>
  );
};

export default AvoidedOtherSecuringCostsDescription;
