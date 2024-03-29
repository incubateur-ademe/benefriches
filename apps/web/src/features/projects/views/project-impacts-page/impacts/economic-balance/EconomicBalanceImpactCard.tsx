import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { baseColumnChartConfig } from "../../../shared/sharedChartConfig";
import ImpactCard from "../../ImpactChartCard";

import { ReconversionProjectImpacts } from "@/features/projects/domain/impacts.types";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";

type PurposeCost = "rent" | "maintenance" | "taxes" | "other";
type SourceRevenue = "operations" | "other";

type Props = {
  costs: ReconversionProjectImpacts["economicBalance"]["costs"];
  revenues: ReconversionProjectImpacts["economicBalance"]["revenues"];
};

const getYearlyCostPurposeLabel = (purpose: PurposeCost) => {
  switch (purpose) {
    case "rent":
      return "Loyer";
    case "maintenance":
      return "Maintenance";
    case "taxes":
      return "Taxes et impôts";
    case "other":
      return "Autres dépenses";
  }
};

const getYearlyRevenueSourceLabel = (source: SourceRevenue) => {
  switch (source) {
    case "operations":
      return "Recettes d’exploitation";
    case "other":
      return "Autres recettes";
  }
};

const getCostsValues = ({
  developmentPlanInstallation,
  siteReinstatement,
  realEstateTransaction,
  operationsCosts,
}: {
  developmentPlanInstallation: Props["costs"]["developmentPlanInstallation"];
  siteReinstatement: Props["costs"]["siteReinstatement"];
  realEstateTransaction: Props["costs"]["realEstateTransaction"];
  operationsCosts: Props["costs"]["operationsCosts"];
}) => {
  return [
    {
      name: "Installation des panneaux photovoltaïque",
      value: developmentPlanInstallation,
    },
    {
      name: "Remise en état de la friche",
      value: siteReinstatement,
    },
    {
      name: "Transaction immobilière",
      value: realEstateTransaction,
    },
    ...operationsCosts.expenses.map(({ amount, purpose }) => ({
      name: getYearlyCostPurposeLabel(purpose),
      value: amount,
    })),
  ].filter((serie) => !!serie.value) as { name: string; value: number }[];
};

const getRevenuesValue = ({
  financialAssistance,
  operationsRevenues,
}: {
  financialAssistance: Props["revenues"]["financialAssistance"];
  operationsRevenues: Props["revenues"]["operationsRevenues"];
}) => {
  return [
    {
      name: "Aides financières",
      value: financialAssistance,
    },
    ...operationsRevenues.revenues.map(({ amount, source }) => ({
      name: getYearlyRevenueSourceLabel(source),
      value: amount,
    })),
  ].filter((serie) => !!serie.value) as { name: string; value: number }[];
};

function EconomicBalanceImpactCard({ revenues, costs }: Props) {
  const { financialAssistance, operationsRevenues } = revenues;
  const { operationsCosts, developmentPlanInstallation, siteReinstatement, realEstateTransaction } =
    costs;

  const maxAbsValue =
    Math.abs(costs.total) > Math.abs(revenues.total) ? Math.abs(costs.total) : revenues.total;

  const barChartOptions: Highcharts.Options = {
    ...baseColumnChartConfig,
    xAxis: {
      categories: [
        `<strong>Dépenses</strong><br>${formatNumberFr(costs.total)} €`,
        `<strong>Recettes</strong><br>+${formatNumberFr(revenues.total)} €`,
      ],
      lineWidth: 0,
    },
    yAxis: {
      min: -maxAbsValue,
      max: maxAbsValue,
      startOnTick: false,
      endOnTick: false,
      title: { text: null },
      plotLines: [
        {
          value: 0,
          width: 2,
          color: "#929292",
        },
      ],
    },
    tooltip: {
      valueSuffix: ` €`,
    },
    plotOptions: {
      column: {
        stacking: "normal",
      },
    },

    series: [
      ...(getRevenuesValue({ operationsRevenues, financialAssistance }).map(({ name, value }) => ({
        name,
        data: [0, roundTo2Digits(value)],
        type: "column",
      })) as Array<Highcharts.SeriesOptionsType>),
      ...(getCostsValues({
        operationsCosts,
        developmentPlanInstallation,
        realEstateTransaction,
        siteReinstatement,
      }).map(({ name, value }) => ({
        name,
        data: [roundTo2Digits(value), 0],
        type: "column",
      })) as Array<Highcharts.SeriesOptionsType>),
    ],
  };

  return (
    <ImpactCard title="Bilan de l'opération">
      {revenues.total > 0 || costs.total > 0 ? (
        <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
      ) : (
        <div>Vous n’avez pas renseigné de coûts ni de dépenses pour ce projet.</div>
      )}
    </ImpactCard>
  );
}

export default EconomicBalanceImpactCard;
