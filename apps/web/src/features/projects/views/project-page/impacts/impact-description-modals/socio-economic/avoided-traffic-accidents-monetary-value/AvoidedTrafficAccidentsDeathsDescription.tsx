import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import AvoidedTrafficAccidentsDeathsContent from "../../shared/avoided-traffic-accidents/AvoidedTrafficAccidentsDeathsContent";
import { breadcrumbSegments } from "./breadcrumbSegments";

const TITLE = "Décès évités";

type Props = {
  impactData?: number;
};

const AvoidedTrafficAccidentsDeathsMonetaryValueDescription = ({ impactData }: Props) => {
  return (
    <>
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
      <ModalContent>
        <AvoidedTrafficAccidentsDeathsContent withMonetarisation />
      </ModalContent>
    </>
  );
};

export default AvoidedTrafficAccidentsDeathsMonetaryValueDescription;
