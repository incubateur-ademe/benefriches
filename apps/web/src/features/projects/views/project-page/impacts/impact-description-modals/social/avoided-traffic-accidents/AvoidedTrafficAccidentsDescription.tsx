import { formatDefaultImpact } from "@/features/projects/views/shared/formatImpactValue";

import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import AvoidedTrafficAccidentsContent from "../../shared/avoided-traffic-accidents/AvoidedTrafficAccidentsContent";
import { breadcrumbSegments } from "./breadcrumbSegments";

const TITLE = "Personnes préservées des accidents de la route";

type Props = {
  impactData?: number;
};

const AvoidedTrafficAccidentsDescription = ({ impactData }: Props) => {
  return (
    <>
      <ModalHeader
        title={`🚘 ${TITLE}`}
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
        <AvoidedTrafficAccidentsContent />
      </ModalContent>
    </>
  );
};

export default AvoidedTrafficAccidentsDescription;
