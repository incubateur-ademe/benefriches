import { formatDefaultImpact } from "@/features/projects/views/shared/formatImpactValue";

import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import AvoidedTrafficAccidentsMinorInjuriesContent from "../../shared/avoided-traffic-accidents/AvoidedTrafficAccidentsMinorInjuriesContent";
import { breadcrumbSegments } from "./breadcrumbSegments";

const TITLE = "Blessés légers évités";

type Props = {
  impactData?: number;
};

const AvoidedTrafficAccidentsMinorInjuriesDescription = ({ impactData }: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title={`🤕 ${TITLE}`}
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
        <AvoidedTrafficAccidentsMinorInjuriesContent />
      </ModalContent>
    </ModalBody>
  );
};

export default AvoidedTrafficAccidentsMinorInjuriesDescription;
