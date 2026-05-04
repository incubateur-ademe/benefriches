import { Options } from "highcharts";
import { useId, useMemo } from "react";
import { ReconversionProjectImpactsBreakEvenLevel, typedObjectEntries } from "shared";

import { withDefaultBarChartOptions } from "@/shared/views/charts";
import { useChartCustomPointColors } from "@/shared/views/charts/useChartCustomColors";
import { getPositiveNegativeTextClassesFromValue } from "@/shared/views/classes/positiveNegativeTextClasses";

import ImpactChartCard from "../../project-page/impacts/charts-view/ImpactChartCard/ImpactChartCard";
import { formatMonetaryImpact } from "../../shared/formatImpactValue";

type Props = Pick<
  ReconversionProjectImpactsBreakEvenLevel,
  "indirectEconomicImpacts" | "stakeholders"
>;

const barChartOptions: Options = withDefaultBarChartOptions({
  tooltip: {
    enabled: false,
  },
  chart: {
    spacingBottom: 0,
    spacingLeft: 0,
    spacingRight: 0,
    spacingTop: 0,
    height: 328,
  },
  plotOptions: {
    column: {
      stacking: "normal",
      dataLabels: {
        enabled: false,
      },
      colorByPoint: true,
    },
  },
  legend: {
    enabled: false,
  },
});

type Bearer = "local_authority" | "local_people_or_company" | "humanity";
const getLabelForBearer = (name: Bearer) => {
  switch (name) {
    case "local_authority":
      return "Collectivité";
    case "local_people_or_company":
      return "Riverains";
    case "humanity":
      return "Société française et mondiale";
  }
};

type IndirectEconomicImpactsName =
  ReconversionProjectImpactsBreakEvenLevel["indirectEconomicImpacts"]["details"][number]["name"];
const isLocalAuthority = (structureType?: string) => structureType === "local_authority";

const getBearerForImpact = (
  name: IndirectEconomicImpactsName,
  stakeholders: Props["stakeholders"],
): Bearer => {
  switch (name) {
    case "avoidedFricheMaintenanceAndSecuringCostsForOwner":
    case "oldRentalIncomeLoss":
    case "projectedRentalIncome":
    case "projectedRentalIncomeIncrease":
      return isLocalAuthority(stakeholders.current.owner?.structureType)
        ? "local_authority"
        : "local_people_or_company";

    case "avoidedFricheMaintenanceAndSecuringCostsForTenant":
      return isLocalAuthority(stakeholders.current.tenant?.structureType)
        ? "local_authority"
        : "local_people_or_company";

    case "previousSiteOperationBenefitLoss":
      return isLocalAuthority(stakeholders.current.operator?.structureType)
        ? "local_authority"
        : "local_people_or_company";

    case "projectOperatingEconomicBalance":
      return isLocalAuthority(stakeholders.project.developer?.structureType)
        ? "local_authority"
        : "local_people_or_company";

    case "propertyTransferDutiesIncome":
    case "localTransferDutiesIncrease":
    case "waterRegulation":
    case "projectNewHousesTaxesIncome":
    case "projectNewCompanyTaxationIncome":
    case "projectPhotovoltaicTaxesIncome":
      return "local_authority";

    case "localPropertyValueIncrease":
    case "avoidedCarRelatedExpenses":
    case "travelTimeSavedPerTravelerExpenses":
      return "local_people_or_company";

    case "avoidedCo2eqWithEnergyProduction":
    case "avoidedAirConditioningCo2eqEmissions":
    case "avoidedTrafficCo2EqEmissions":
    case "avoidedAirConditioningExpenses":
    case "avoidedTrafficCO2Emissions":
    case "storedCo2Eq":
    case "natureRelatedWelnessAndLeisure":
    case "forestRelatedProduct":
    case "pollination":
    case "invasiveSpeciesRegulation":
    case "waterCycle":
    case "nitrogenCycle":
    case "soilErosion":
    case "avoidedPropertyDamageExpenses":
    case "avoidedAirPollutionHealthExpenses":
    case "avoidedAccidentsMinorInjuriesExpenses":
    case "avoidedAccidentsSevereInjuriesExpenses":
    case "avoidedAccidentsDeathsExpenses":
      return "humanity";
  }
};
const getColorForBearer = (name: Bearer) => {
  switch (name) {
    case "local_authority":
      return "#1D5DA2";
    case "local_people_or_company":
      return "#FD7CC5";
    case "humanity":
      return "#9EE24B";
  }
};

export default function IndirectEconomicImpactsChart({
  indirectEconomicImpacts,
  stakeholders,
}: Props) {
  const data = useMemo(() => {
    const totalByBearer = indirectEconomicImpacts.details.reduce<Record<Bearer, number>>(
      (acc, { name, total }) => {
        const bearer = getBearerForImpact(name, stakeholders);
        acc[bearer] = (acc[bearer] ?? 0) + total;
        return acc;
      },
      { local_authority: 0, local_people_or_company: 0, humanity: 0 },
    );

    return typedObjectEntries(totalByBearer)
      .map(([bearer, total]) => ({
        name: getLabelForBearer(bearer),
        y: total,
        color: getColorForBearer(bearer),
      }))
      .filter(({ y }) => y !== 0);
  }, [indirectEconomicImpacts.details, stakeholders]);

  const chartContainerId = useId();

  const colors = data.map(({ color }) => color);

  useChartCustomPointColors(chartContainerId, colors);

  return (
    <ImpactChartCard
      containerProps={{
        className: "highcharts-no-xaxis",
        id: chartContainerId,
      }}
      title="👥 Impacts socio-économiques"
      options={
        {
          ...barChartOptions,
          subtitle: {
            useHTML: true,
            text: `<span class='text-sm py-4'>Montant total des impacts : <span class='font-bold ${getPositiveNegativeTextClassesFromValue(indirectEconomicImpacts.total)}'>${formatMonetaryImpact(indirectEconomicImpacts.total)}</span>`,
            verticalAlign: "bottom",
            align: "left",
          },
          xAxis: {
            categories: data.map(({ name }) => name),
            labels: {
              formatter: function () {
                return `<strong>${data[this.pos]?.name}</strong><br>${formatMonetaryImpact(data[this.pos]?.y ?? 0)}`;
              },
            },
          },

          series: [
            {
              type: "column",
              name: "Montant (en €)",
              data,
            },
          ],
        } as Highcharts.Options
      }
      exportingOptions={{
        chartOptions: { xAxis: { lineWidth: 0 } },
        colors,
      }}
    />
  );
}
