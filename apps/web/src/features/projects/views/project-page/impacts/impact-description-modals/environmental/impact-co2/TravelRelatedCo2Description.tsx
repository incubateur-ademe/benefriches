import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import TravelRelatedCo2Content from "../../shared/co2-emissions/TravelRelatedCo2Content";
import { breadcrumbSegments } from "./breadcrumbSegments";

type Props = {
  impactData?: number;
};

const TravelRelatedCo2Description = ({ impactData }: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title="🚙 Evitées grâce aux déplacements en voiture évités"
        value={
          impactData
            ? {
                state: "success",
                text: formatCO2Impact(impactData),
              }
            : undefined
        }
        breadcrumbSegments={[
          ...breadcrumbSegments,
          { label: "Evitées grâce aux déplacements en voiture évités" },
        ]}
      />
      <ModalContent fullWidth>
        <TravelRelatedCo2Content />
      </ModalContent>
    </ModalBody>
  );
};

export default TravelRelatedCo2Description;
