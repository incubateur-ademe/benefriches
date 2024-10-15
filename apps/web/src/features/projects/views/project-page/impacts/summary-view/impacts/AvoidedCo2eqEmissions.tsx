import { formatPerFrenchPersonAnnualEquivalent } from "@/features/create-project/views/common-views/soils-carbon-storage-comparison/formatCarbonStorage";
import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";
import { getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson } from "@/shared/domain/carbonEmissions";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  value: number;
  isSuccess: boolean;
  descriptionDisplayMode?: "inline" | "tooltip";
};

const ImpactSummaryAvoidedCo2eqEmissions = ({
  value,
  isSuccess,
  descriptionDisplayMode,
}: Props) => {
  const co2eqValue = Math.abs(value);
  const co2eqValueText = formatCO2Impact(co2eqValue, { withSignPrefix: false });
  const frenchPersonAnnualEquivalent =
    getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson(co2eqValue);

  const frenchPersonAnnualEquivalentText = formatPerFrenchPersonAnnualEquivalent(
    frenchPersonAnnualEquivalent,
  );

  if (isSuccess) {
    return (
      <KeyImpactIndicatorCard
        type="success"
        description={`${co2eqValueText} de CO2-éq évitées, soit les émissions de ${frenchPersonAnnualEquivalentText} français pendant 1 an`}
        title="- d’émissions de CO2&nbsp;☁️"
        descriptionDisplayMode={descriptionDisplayMode}
      />
    );
  }

  return (
    <KeyImpactIndicatorCard
      type="error"
      description={`${co2eqValueText} de CO2-éq émises, soit les émissions de ${frenchPersonAnnualEquivalentText} français pendant 1 an`}
      title="+ d’émissions de CO2&nbsp;☁️"
      descriptionDisplayMode={descriptionDisplayMode}
    />
  );
};

export default ImpactSummaryAvoidedCo2eqEmissions;
