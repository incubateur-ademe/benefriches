import { formatDefaultImpact } from "@/features/projects/views/shared/formatImpactValue";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import AvoidedTrafficAccidentsSevereInjuriesContent from "../../shared/avoided-traffic-accidents/AvoidedTrafficAccidentsSevereInjuriesContent";
import { breadcrumbSegments } from "./breadcrumbSegments";

const TITLE = "Blessés graves évités";

type Props = {
  impactData?: number;
};

const AvoidedTrafficAccidentsSevereInjuriesDescription = ({ impactData }: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title={`🚑 ${TITLE}`}
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
      <ModalContent fullWidth>
        <AvoidedTrafficAccidentsSevereInjuriesContent />
      </ModalContent>
    </ModalBody>
  );
};

export default AvoidedTrafficAccidentsSevereInjuriesDescription;
