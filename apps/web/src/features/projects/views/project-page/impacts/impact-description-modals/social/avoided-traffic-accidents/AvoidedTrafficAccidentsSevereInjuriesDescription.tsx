import { formatDefaultImpact } from "@/features/projects/views/shared/formatImpactValue";

import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import AvoidedTrafficAccidentsSevereInjuriesContent from "../../shared/avoided-traffic-accidents/AvoidedTrafficAccidentsSevereInjuriesContent";
import { breadcrumbSegments } from "./breadcrumbSegments";

const TITLE = "Blessés graves évités";

type Props = {
  impactData?: number;
};

const AvoidedTrafficAccidentsSevereInjuriesDescription = ({ impactData }: Props) => {
  return (
    <>
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
      <ModalContent>
        <AvoidedTrafficAccidentsSevereInjuriesContent />
      </ModalContent>
    </>
  );
};

export default AvoidedTrafficAccidentsSevereInjuriesDescription;
