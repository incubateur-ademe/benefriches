import { useContext } from "react";

import { EnvironmentalImpact } from "@/features/projects/domain/projectImpactsEnvironmental";
import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";

import { getEnvironmentalDetailsImpactLabel } from "../../../getImpactLabel";
import ImpactItemDetails from "../../../list-view/ImpactItemDetails";
import ImpactItemGroup from "../../../list-view/ImpactItemGroup";
import { ImpactModalDescriptionContext } from "../../ImpactModalDescriptionContext";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import { breadcrumbSection } from "../breadcrumbSection";

type Props = {
  impactsData: EnvironmentalImpact[];
};

const Co2BenefitDescription = ({ impactsData }: Props) => {
  const co2Benefit = impactsData.find(({ name }) => "co2_benefit" === name);

  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  const total = co2Benefit?.impact.difference ?? 0;
  const details = co2Benefit?.impact.details ?? [];

  return (
    <>
      <ModalHeader
        title="☁️ CO2-eq stocké ou évité"
        value={{
          text: formatCO2Impact(total),
          description: "pour l'humanité",
          state: total > 0 ? "success" : "error",
        }}
        breadcrumbSegments={[breadcrumbSection, { label: "CO2-eq stocké ou évité" }]}
      />
      <ModalContent>
        <div className="tw-flex tw-flex-col">
          {details.map(({ impact, name }) => (
            <ImpactItemGroup isClickable key={name}>
              <ImpactItemDetails
                value={impact.difference}
                label={getEnvironmentalDetailsImpactLabel("co2_benefit", name)}
                type="co2"
                onClick={() => {
                  openImpactModalDescription({
                    sectionName: "environmental",
                    impactName: "co2_benefit",
                    impactDetailsName: name,
                  });
                }}
              />
            </ImpactItemGroup>
          ))}
        </div>
      </ModalContent>
    </>
  );
};

export default Co2BenefitDescription;
