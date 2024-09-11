import ImpactSyntheticCard from "../ImpactSyntheticCard";

import { formatPerFrenchPersonAnnualEquivalent } from "@/features/create-project/views/soils/soils-carbon-storage/formatCarbonStorage";
import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";
import { getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson } from "@/shared/domain/carbonEmissions";

type Props = {
  value: number;
  isSuccess: boolean;
  small?: boolean;
};

const ImpactSynthesisAvoidedCo2eqEmissions = ({ value, isSuccess, ...props }: Props) => {
  const frenchPersonAnnualEquivalent = formatPerFrenchPersonAnnualEquivalent(
    getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson(value),
  );
  if (isSuccess) {
    return (
      <ImpactSyntheticCard
        {...props}
        type="success"
        tooltipText={`${formatCO2Impact(value)} de CO2-éq évitées, soit les émissions de ${frenchPersonAnnualEquivalent} français pendant 1 an`}
        text="- d’émissions de CO2&nbsp;☁️"
      />
    );
  }

  return (
    <ImpactSyntheticCard
      {...props}
      type="error"
      tooltipText={`${formatCO2Impact(value)} de CO2-éq émises, soit les émissions de ${frenchPersonAnnualEquivalent} français pendant 1 an`}
      text="+ d’émissions de CO2&nbsp;☁️"
    />
  );
};

export default ImpactSynthesisAvoidedCo2eqEmissions;
