import { formatDefaultImpact } from "@/features/projects/views/shared/formatImpactValue";

import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import AvoidedTrafficAccidentsDeathsContent from "../../shared/avoided-traffic-accidents/AvoidedTrafficAccidentsDeathsContent";
import { breadcrumbSegments } from "./breadcrumbSegments";

const TITLE = "Décès évités";

type Props = {
  impactData?: number;
};

const AvoidedTrafficAccidentsDeathsDescription = ({ impactData }: Props) => {
  return (
    <ModalBody>
      <ModalHeader
        title={`🪦 ${TITLE}`}
        subtitle="Grâce aux déplacements évités"
        value={
          impactData
            ? {
                state: "success",
                text: formatDefaultImpact(impactData),
              }
            : undefined
        }
        breadcrumbSegments={[...breadcrumbSegments, { label: TITLE }]}
      />
      <ModalContent>
        <AvoidedTrafficAccidentsDeathsContent />
      </ModalContent>
    </ModalBody>
  );
};

export default AvoidedTrafficAccidentsDeathsDescription;
