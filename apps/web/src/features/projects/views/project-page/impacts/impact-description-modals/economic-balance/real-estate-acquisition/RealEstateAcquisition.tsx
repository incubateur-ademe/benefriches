import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import { breadcrumbSection } from "../breadcrumbSection";

type Props = {
  impactData?: number;
  bearer?: string;
};

const RealEstateAcquisitionDescription = ({ impactData, bearer = "l'aménageur" }: Props) => {
  return (
    <ModalBody>
      <ModalHeader
        title="🏠 Acquisition du site"
        breadcrumbSegments={[breadcrumbSection, { label: "Acquisition du site" }]}
        value={
          impactData
            ? {
                state: impactData > 0 ? "success" : "error",
                text: formatMonetaryImpact(impactData),
                description: `pour ${bearer}`,
              }
            : undefined
        }
      />
      <ModalContent>
        <p>
          Il s'agit des dépenses d'acquisition foncière (y compris bâtiments) nécessaires à la
          réalisation du projet, auxquelles s'ajoutent les éventuels frais d'enregistrement (« frais
          de notaire ») et autres frais (frais d'évictions, etc.).
        </p>
        <p>La valeur est saisie par l'utilisateur.</p>
        <p>
          <strong>Déficitaire</strong> : futur propriétaire
        </p>
      </ModalContent>
    </ModalBody>
  );
};

export default RealEstateAcquisitionDescription;
