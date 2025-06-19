import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import AirConditionningRelatedCo2Content from "../../shared/co2-emissions/AirConditionningRelatedCo2Content";
import { breadcrumbSegments } from "./breadcrumbSegments";

type Props = {
  impactData?: number;
};

const AirConditionningRelatedCo2MonetaryValueDescription = ({ impactData }: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title="❄️ Utilisation réduite de la climatisation"
        value={
          impactData
            ? {
                state: "success",
                text: formatMonetaryImpact(impactData),
                description: "pour l'humanité",
              }
            : undefined
        }
        breadcrumbSegments={[
          ...breadcrumbSegments,
          { label: "Utilisation réduite de la climatisation" },
        ]}
      />
      <ModalContent fullWidth>
        <AirConditionningRelatedCo2Content withMonetarisation />
      </ModalContent>
    </ModalBody>
  );
};

export default AirConditionningRelatedCo2MonetaryValueDescription;
