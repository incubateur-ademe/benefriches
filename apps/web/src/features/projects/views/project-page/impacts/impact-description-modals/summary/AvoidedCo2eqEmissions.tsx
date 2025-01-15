import { useContext } from "react";

import { formatPerFrenchPersonAnnualEquivalent } from "@/features/create-project/views/common-views/soils-carbon-storage-comparison/formatCarbonStorage";
import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";
import { getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson } from "@/shared/domain/carbonEmissions";

import ImpactItemDetails from "../../list-view/ImpactItemDetails";
import ImpactItemGroup from "../../list-view/ImpactItemGroup";
import { ImpactModalDescriptionContext } from "../ImpactModalDescriptionContext";
import ModalContent from "../shared/ModalContent";
import ModalHeader from "../shared/ModalHeader";

type Props = {
  impactData: {
    value: number;
    isSuccess: boolean;
  };
};

const SummaryAvoidedCo2eqEmissionsDescription = ({ impactData }: Props) => {
  const { value, isSuccess } = impactData;
  const co2eqValue = Math.abs(value);
  const co2eqValueText = formatCO2Impact(co2eqValue, { withSignPrefix: false });

  const frenchPersonAnnualEquivalent =
    getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson(co2eqValue);
  const frenchPersonAnnualEquivalentText = formatPerFrenchPersonAnnualEquivalent(
    frenchPersonAnnualEquivalent,
  );

  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);
  const title = isSuccess ? "- d’émissions de CO2\u00a0☁️" : "+ d’émissions de CO2\u00a0☁️";

  return (
    <>
      <ModalHeader
        title={title}
        value={{
          text: co2eqValueText,
          state: isSuccess ? "success" : "error",
          description: isSuccess
            ? `de CO2-éq évitées, soit les émissions de ${frenchPersonAnnualEquivalentText} français pendant 1 an`
            : `de CO2-éq émises, soit les émissions de ${frenchPersonAnnualEquivalentText} français pendant 1 an`,
        }}
        breadcrumbSegments={[{ label: "Synthèse" }, { label: title }]}
      />
      <ModalContent>
        {isSuccess ? (
          <ImpactItemGroup isClickable>
            <ImpactItemDetails
              impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
              value={co2eqValue}
              label="☁️ CO2-eq stocké ou évité"
              type="co2"
              onClick={() => {
                openImpactModalDescription({
                  sectionName: "environmental",
                  impactName: "co2_benefit",
                });
              }}
            />
          </ImpactItemGroup>
        ) : (
          <p>
            <i>En cours de rédaction...</i>
          </p>
        )}
      </ModalContent>
    </>
  );
};

export default SummaryAvoidedCo2eqEmissionsDescription;
