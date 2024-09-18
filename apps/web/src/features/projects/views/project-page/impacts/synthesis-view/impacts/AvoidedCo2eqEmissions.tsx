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
  const co2eqValue = Math.abs(value);
  const co2eqValueText = formatCO2Impact(co2eqValue, { withSignPrefix: false });
  const frenchPersonAnnualEquivalent =
    getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson(co2eqValue);

  const frenchPersonAnnualEquivalentText = formatPerFrenchPersonAnnualEquivalent(
    frenchPersonAnnualEquivalent,
  );

  if (isSuccess) {
    return (
      <ImpactSyntheticCard
        {...props}
        type="success"
        tooltipText={`${co2eqValueText} de CO2-éq évitées, soit les émissions de ${frenchPersonAnnualEquivalentText} français pendant 1 an`}
        text="- d’émissions de CO2&nbsp;☁️"
      />
    );
  }

  return (
    <ImpactSyntheticCard
      {...props}
      type="error"
      tooltipText={`${co2eqValueText} de CO2-éq émises, soit les émissions de ${frenchPersonAnnualEquivalentText} français pendant 1 an`}
      text="+ d’émissions de CO2&nbsp;☁️"
    />
  );
};

export default ImpactSynthesisAvoidedCo2eqEmissions;
