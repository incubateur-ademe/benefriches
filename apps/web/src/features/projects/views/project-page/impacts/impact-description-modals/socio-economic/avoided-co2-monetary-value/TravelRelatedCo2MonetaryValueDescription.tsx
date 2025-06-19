import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import TravelRelatedCo2Content from "../../shared/co2-emissions/TravelRelatedCo2Content";
import { breadcrumbSegments } from "./breadcrumbSegments";

type Props = {
  impactData?: number;
};

const TravelRelatedCo2MonetaryValueDescription = ({ impactData }: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title="🚙 Déplacements en voiture évités"
        value={
          impactData
            ? {
                state: "success",
                text: formatMonetaryImpact(impactData),
                description: "pour l'humanité",
              }
            : undefined
        }
        breadcrumbSegments={[...breadcrumbSegments, { label: "Déplacements en voiture évités" }]}
      />
      <ModalContent fullWidth>
        <TravelRelatedCo2Content withMonetarisation />
      </ModalContent>
    </ModalBody>
  );
};

export default TravelRelatedCo2MonetaryValueDescription;
