import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import AvoidedTrafficAccidentsContent from "../../shared/avoided-traffic-accidents/AvoidedTrafficAccidentsContent";
import { mainBreadcrumbSection, socialMonetaryBreadcrumbSection } from "../breadcrumbSections";

const TITLE = "Dépenses de santé évitées grâce à la diminution des accidents de la route";

type Props = {
  impactData?: number;
};

const AvoidedTrafficAccidentsMonetaryValueDescription = ({ impactData }: Props) => {
  return (
    <ModalBody>
      <ModalHeader
        title={`🚘 ${TITLE}`}
        subtitle="Grâce aux déplacements évités"
        value={
          impactData
            ? {
                state: "success",
                text: formatMonetaryImpact(impactData),
              }
            : undefined
        }
        breadcrumbSegments={[
          mainBreadcrumbSection,
          socialMonetaryBreadcrumbSection,
          { label: TITLE },
        ]}
      />
      <ModalContent>
        <AvoidedTrafficAccidentsContent withMonetarisation />
      </ModalContent>
    </ModalBody>
  );
};

export default AvoidedTrafficAccidentsMonetaryValueDescription;
