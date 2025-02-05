import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import AvoidedTrafficAccidentsSevereInjuriesContent from "../../shared/avoided-traffic-accidents/AvoidedTrafficAccidentsSevereInjuriesContent";
import { breadcrumbSegments } from "./breadcrumbSegments";

const TITLE = "Blessés graves évités";

type Props = {
  impactData?: number;
};

const AvoidedTrafficAccidentsSevereInjuriesMonetaryValueDescription = ({ impactData }: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title={`🚑 ${TITLE}`}
        subtitle="Grâce aux déplacements évités"
        value={
          impactData
            ? {
                state: "success",
                text: formatMonetaryImpact(impactData),
              }
            : undefined
        }
        breadcrumbSegments={[...breadcrumbSegments, { label: TITLE }]}
      />
      <ModalContent fullWidth>
        <AvoidedTrafficAccidentsSevereInjuriesContent withMonetarisation />
      </ModalContent>
    </ModalBody>
  );
};

export default AvoidedTrafficAccidentsSevereInjuriesMonetaryValueDescription;
