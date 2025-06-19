import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import AvoidedTrafficAccidentsDeathsContent from "../../shared/avoided-traffic-accidents/AvoidedTrafficAccidentsDeathsContent";
import { breadcrumbSegments } from "./breadcrumbSegments";

const TITLE = "Décès évités";

type Props = {
  impactData?: number;
};

const AvoidedTrafficAccidentsDeathsMonetaryValueDescription = ({ impactData }: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title={`🪦 ${TITLE}`}
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
        <AvoidedTrafficAccidentsDeathsContent withMonetarisation />
      </ModalContent>
    </ModalBody>
  );
};

export default AvoidedTrafficAccidentsDeathsMonetaryValueDescription;
