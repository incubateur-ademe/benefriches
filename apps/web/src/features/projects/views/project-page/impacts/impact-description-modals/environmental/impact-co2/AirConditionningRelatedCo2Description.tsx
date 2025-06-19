import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import AirConditionningRelatedCo2Content from "../../shared/co2-emissions/AirConditionningRelatedCo2Content";
import { breadcrumbSegments } from "./breadcrumbSegments";

type Props = {
  impactData?: number;
};

const AirConditionningRelatedCo2Description = ({ impactData }: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title="❄️ Evitées grâce à l’utilisation réduite de la climatisation"
        value={
          impactData
            ? {
                state: "success",
                text: formatCO2Impact(impactData),
              }
            : undefined
        }
        breadcrumbSegments={[
          ...breadcrumbSegments,
          { label: "Evitées grâce à l’utilisation réduite de la climatisation" },
        ]}
      />
      <ModalContent fullWidth>
        <AirConditionningRelatedCo2Content />
      </ModalContent>
    </ModalBody>
  );
};

export default AirConditionningRelatedCo2Description;
