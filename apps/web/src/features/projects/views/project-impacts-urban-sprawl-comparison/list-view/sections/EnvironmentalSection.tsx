import { UrbanSprawlComparisonImpacts } from "shared";

import { getEnvironmentalDetailsImpactLabel } from "../../../project-page/impacts/getImpactLabel";
import { formatCO2Impact, formatSurfaceAreaImpact } from "../../../shared/formatImpactValue";
import TableAccordionRow from "../layout/TableAccordionRows";
import ImpactComparisonTableRow from "../layout/TableRow";
import ImpactComparisonTableSectionRow from "../layout/TableSectionRow";
import ImpactComparisonTableSeparatorRow from "../layout/TableSeparatorRow";

type Props = {
  baseCase: {
    impacts: UrbanSprawlComparisonImpacts;
    siteName: string;
  };
  comparisonCase: {
    impacts: UrbanSprawlComparisonImpacts;
    siteName: string;
  };
};

const sumValues = (values: (number | undefined)[]) => {
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
};
const ImpactComparisonEnvironmentalSection = ({ baseCase, comparisonCase }: Props) => {
  return (
    <ImpactComparisonTableSectionRow label="Impacts environnementaux">
      {(() => {
        const baseSoilsCo2eqStorage = baseCase.impacts.environmental.soilsCo2eqStorage;
        const baseAvoidedCo2eqEmissions = baseCase.impacts.environmental.avoidedCo2eqEmissions;
        const comparisonSoilsCo2eqStorage = comparisonCase.impacts.environmental.soilsCo2eqStorage;
        const comparisonAvoidedCo2eqEmissions =
          comparisonCase.impacts.environmental.avoidedCo2eqEmissions;

        if (
          !baseSoilsCo2eqStorage &&
          !baseAvoidedCo2eqEmissions &&
          !comparisonSoilsCo2eqStorage &&
          !comparisonAvoidedCo2eqEmissions
        ) {
          return null;
        }

        const formatValueFn = formatCO2Impact;

        return (
          <ImpactComparisonTableSectionRow label="Impacts sur le CO2-eq" subSection>
            <TableAccordionRow
              label="☁️ CO2-eq stocké ou évité"
              baseValue={sumValues([
                baseSoilsCo2eqStorage?.difference,
                baseAvoidedCo2eqEmissions?.withAirConditioningDiminution,
                baseAvoidedCo2eqEmissions?.withCarTrafficDiminution,
                baseAvoidedCo2eqEmissions?.withRenewableEnergyProduction,
              ])}
              comparisonValue={sumValues([
                comparisonSoilsCo2eqStorage?.difference,
                comparisonAvoidedCo2eqEmissions?.withAirConditioningDiminution,
                comparisonAvoidedCo2eqEmissions?.withCarTrafficDiminution,
                comparisonAvoidedCo2eqEmissions?.withRenewableEnergyProduction,
              ])}
              formatValueFn={formatValueFn}
            >
              {baseSoilsCo2eqStorage || comparisonSoilsCo2eqStorage ? (
                <ImpactComparisonTableRow
                  label={getEnvironmentalDetailsImpactLabel("co2_benefit", "stored_co2_eq")}
                  isLast={!baseAvoidedCo2eqEmissions && !comparisonAvoidedCo2eqEmissions}
                  baseValue={baseSoilsCo2eqStorage?.difference ?? 0}
                  comparisonValue={comparisonSoilsCo2eqStorage?.difference ?? 0}
                  formatValueFn={formatValueFn}
                />
              ) : undefined}
              {baseAvoidedCo2eqEmissions?.withAirConditioningDiminution ||
              comparisonAvoidedCo2eqEmissions?.withAirConditioningDiminution ? (
                <ImpactComparisonTableRow
                  label={getEnvironmentalDetailsImpactLabel(
                    "co2_benefit",
                    "avoided_air_conditioning_co2_eq_emissions",
                  )}
                  isLast={
                    !baseAvoidedCo2eqEmissions?.withCarTrafficDiminution &&
                    !comparisonAvoidedCo2eqEmissions?.withCarTrafficDiminution &&
                    !baseAvoidedCo2eqEmissions?.withRenewableEnergyProduction &&
                    !comparisonAvoidedCo2eqEmissions?.withRenewableEnergyProduction
                  }
                  baseValue={baseAvoidedCo2eqEmissions?.withAirConditioningDiminution ?? 0}
                  comparisonValue={
                    comparisonAvoidedCo2eqEmissions?.withAirConditioningDiminution ?? 0
                  }
                  formatValueFn={formatValueFn}
                />
              ) : undefined}
              {baseAvoidedCo2eqEmissions?.withCarTrafficDiminution ||
              comparisonAvoidedCo2eqEmissions?.withCarTrafficDiminution ? (
                <ImpactComparisonTableRow
                  label={getEnvironmentalDetailsImpactLabel(
                    "co2_benefit",
                    "avoided_car_traffic_co2_eq_emissions",
                  )}
                  isLast={
                    !baseAvoidedCo2eqEmissions?.withRenewableEnergyProduction &&
                    !comparisonAvoidedCo2eqEmissions?.withRenewableEnergyProduction
                  }
                  baseValue={baseAvoidedCo2eqEmissions?.withCarTrafficDiminution ?? 0}
                  comparisonValue={comparisonAvoidedCo2eqEmissions?.withCarTrafficDiminution ?? 0}
                  formatValueFn={formatValueFn}
                />
              ) : undefined}
              {baseAvoidedCo2eqEmissions?.withRenewableEnergyProduction ||
              comparisonAvoidedCo2eqEmissions?.withRenewableEnergyProduction ? (
                <ImpactComparisonTableRow
                  label={getEnvironmentalDetailsImpactLabel(
                    "co2_benefit",
                    "avoided_co2_eq_emissions_with_production",
                  )}
                  isLast
                  baseValue={baseAvoidedCo2eqEmissions?.withRenewableEnergyProduction ?? 0}
                  comparisonValue={
                    comparisonAvoidedCo2eqEmissions?.withRenewableEnergyProduction ?? 0
                  }
                  formatValueFn={formatValueFn}
                />
              ) : undefined}
            </TableAccordionRow>
          </ImpactComparisonTableSectionRow>
        );
      })()}

      {(() => {
        const baseNonContaminatedSurfaceArea =
          baseCase.impacts.environmental.nonContaminatedSurfaceArea?.difference;
        const comparisonNonContaminatedSurfaceArea =
          comparisonCase.impacts.environmental.nonContaminatedSurfaceArea?.difference;

        const basePermeableSurfaceArea = baseCase.impacts.environmental.permeableSurfaceArea;
        const comparisonPermeableSurfaceArea =
          comparisonCase.impacts.environmental.permeableSurfaceArea;

        if (
          !baseNonContaminatedSurfaceArea &&
          !comparisonNonContaminatedSurfaceArea &&
          !basePermeableSurfaceArea.difference &&
          !comparisonPermeableSurfaceArea.difference
        ) {
          return null;
        }
        const formatValueFn = formatSurfaceAreaImpact;

        return (
          <ImpactComparisonTableSectionRow label="Impacts sur les sols" subSection>
            {baseNonContaminatedSurfaceArea || comparisonNonContaminatedSurfaceArea ? (
              <ImpactComparisonTableRow
                label="✨ Surface non polluée"
                baseValue={baseNonContaminatedSurfaceArea ?? 0}
                comparisonValue={comparisonNonContaminatedSurfaceArea ?? 0}
                isFirst
                isLast
                formatValueFn={formatValueFn}
              />
            ) : undefined}
            <ImpactComparisonTableSeparatorRow />

            <TableAccordionRow
              label="🌧 Surface perméable"
              baseValue={basePermeableSurfaceArea.difference}
              comparisonValue={comparisonPermeableSurfaceArea.difference}
              formatValueFn={formatValueFn}
            >
              {basePermeableSurfaceArea.mineralSoil.difference ||
              comparisonPermeableSurfaceArea.mineralSoil.difference ? (
                <ImpactComparisonTableRow
                  label={getEnvironmentalDetailsImpactLabel(
                    "permeable_surface_area",
                    "mineral_soil",
                  )}
                  isLast={
                    !basePermeableSurfaceArea.greenSoil.difference &&
                    !comparisonPermeableSurfaceArea.greenSoil.difference
                  }
                  baseValue={basePermeableSurfaceArea.mineralSoil.difference}
                  comparisonValue={comparisonPermeableSurfaceArea.mineralSoil.difference}
                  formatValueFn={formatValueFn}
                />
              ) : undefined}
              {basePermeableSurfaceArea.greenSoil.difference ||
              comparisonPermeableSurfaceArea.greenSoil.difference ? (
                <ImpactComparisonTableRow
                  label={getEnvironmentalDetailsImpactLabel("permeable_surface_area", "green_soil")}
                  isLast
                  baseValue={basePermeableSurfaceArea.greenSoil.difference}
                  comparisonValue={comparisonPermeableSurfaceArea.greenSoil.difference}
                  formatValueFn={formatValueFn}
                />
              ) : undefined}
            </TableAccordionRow>
          </ImpactComparisonTableSectionRow>
        );
      })()}
    </ImpactComparisonTableSectionRow>
  );
};

export default ImpactComparisonEnvironmentalSection;
