import type { Options } from "highcharts";
import { useId } from "react";
import type { LetterGrade } from "shared";
import type { Link } from "type-route";

import type { DevelopmentScoreDataView } from "@/features/projects/application/project-impacts/selectors/projectDevelopmentScore.selectors";
import { withDefaultBarChartOptions } from "@/shared/views/charts";

import ImpactChartCard from "../shared/charts/ImpactChartCard";
import { formatEvolutionPercentage, formatMonetaryImpact } from "../shared/formatImpactValue";
import ProjectDevelopmentGrade from "./layout/ProjectDevelopmentGrade";
import GradeTextBadge from "./layout/ProjectDevelopmentScoreGradeTextBadge";

const icon = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M38.8281 36.6406V16.5625H32.8125V26.3281H28.5938L24.8438 22.5781H20.4688V36.6406H13.6789V10.7031H15V9.38984H27.5V13.2031H29.8438V9.38984H35.7133L28.6898 2.34375H15V1.01562H5.3125V2.34375H0.46875V9.38984H5.3125V10.7031H6.63359V36.6406H0V38.9844H40V36.6406H38.8281ZM27.7334 4.70516L27.7336 4.70547L30.068 7.04609H25.3924L27.7334 4.70516ZM24.4365 4.6875L22.1484 6.97555L19.8604 4.6875H24.4365ZM15 4.6875H16.5459L18.9045 7.04609H15V4.6875ZM5.3125 7.04609H2.8125V4.6875H5.3125V7.04609ZM11.3352 36.6406H8.97734V31.25H11.3352V36.6406ZM11.3352 28.9062H8.97734V23.5938H11.3352V28.9062ZM11.3352 21.25H8.97734V15.9375H11.3352V21.25ZM11.3352 13.5938H8.97734V10.7031H11.3352V13.5938ZM27.6562 34.375H25.3125V30.7031H27.6562V34.375ZM34.8438 34.375H32.5V30.7031H34.8438V34.375Z" fill="#757575" />
</svg>`;

type Props = DevelopmentScoreDataView["details"]["localAuthorityEconomicScore"] & {
  linkProps?: Link;
};

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
    series: {
      marker: { enabled: true },
    },
    column: {
      stacking: "normal",

      dataLabels: {
        enabled: true,
        useHTML: true,
        formatter: function () {
          return `<img src='url(data:image/svg+xml;charset=UTF-8,${encodeURIComponent(icon)})'>`;
        },
        y: 0,
      },
      colorByPoint: true,
    },
  },
  legend: {
    enabled: false,
  },
});

const getLetterGradeBadgeText = (letterGrade: LetterGrade) => {
  switch (letterGrade) {
    case "A":
      return "Très positif";
    case "B":
      return "Positif";
    case "C":
      return "Neutre";
    case "D":
      return "Négatif";
    case "E":
      return "Très négatif";
  }
};

export default function ProjectDevelopmentLocalAuthorityFinancesScore({
  score,
  details,
  linkProps,
}: Props) {
  const chartContainerId = useId();

  if (!details.localAuthorityFinances) {
    return null;
  }

  const {
    projectLocalAuthorityIndirectEconomicImpactsTotal,
    municipalityCapitalExpendituresAmount,
    municipalityCapitalExpendituresReferenceYear,
    percentageComparison,
  } = details.localAuthorityFinances.metrics;

  const data = [
    {
      name: "Votre projet",
      y: projectLocalAuthorityIndirectEconomicImpactsTotal,
      color: "#86bc2f",
    },
    {
      name: `Dépenses d’équipement de la collectivité (${municipalityCapitalExpendituresReferenceYear})`,
      y: municipalityCapitalExpendituresAmount,
      color: "#eeeeee",
      dataLabels: {
        enabled: true,
        useHTML: true,
        inside: true,
        verticalAlign: "middle",
        align: "center",
        formatter() {
          return `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M38.8281 36.6406V16.5625H32.8125V26.3281H28.5938L24.8438 22.5781H20.4688V36.6406H13.6789V10.7031H15V9.38984H27.5V13.2031H29.8438V9.38984H35.7133L28.6898 2.34375H15V1.01562H5.3125V2.34375H0.46875V9.38984H5.3125V10.7031H6.63359V36.6406H0V38.9844H40V36.6406H38.8281ZM27.7334 4.70516L27.7336 4.70547L30.068 7.04609H25.3924L27.7334 4.70516ZM24.4365 4.6875L22.1484 6.97555L19.8604 4.6875H24.4365ZM15 4.6875H16.5459L18.9045 7.04609H15V4.6875ZM5.3125 7.04609H2.8125V4.6875H5.3125V7.04609ZM11.3352 36.6406H8.97734V31.25H11.3352V36.6406ZM11.3352 28.9062H8.97734V23.5938H11.3352V28.9062ZM11.3352 21.25H8.97734V15.9375H11.3352V21.25ZM11.3352 13.5938H8.97734V10.7031H11.3352V13.5938ZM27.6562 34.375H25.3125V30.7031H27.6562V34.375ZM34.8438 34.375H32.5V30.7031H34.8438V34.375Z" fill="#757575" />
</svg>`;
        },
      },
    },
  ];
  const colors = data.map(({ color }) => color);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="">
        <h4>Finances de la collectivité locale</h4>
        <ProjectDevelopmentGrade score={score} />
      </div>

      <div className="md:col-span-2 highcharts-no-xaxis">
        <ImpactChartCard
          linkProps={linkProps}
          containerProps={{
            className: "highcharts-no-xaxis",
            id: chartContainerId,
          }}
          headerSlot={{
            element: (
              <GradeTextBadge
                letterGrade={score.letterGrade}
                badgeText={getLetterGradeBadgeText(score.letterGrade)}
              />
            ),
            preventClick: false,
          }}

          title="🏛️ Impacts économiques pour la collectivité locale"
          options={{
            ...barChartOptions,
            chart: {
              ...barChartOptions.chart,
              events: {
                render: function () {
                  if (!this.container) {
                    return;
                  }
                  colors.forEach((color, colorIndex) => {
                    this.container
                      .querySelectorAll<HTMLElement>(
                        `.highcharts-point.highcharts-color-${colorIndex}`,
                      )
                      .forEach((point) => {
                        point.style.setProperty(`--highcharts-color-${colorIndex}`, color);
                      });
                  });
                },
              },
            },
            subtitle: {
              useHTML: true,
              text: `<span class='text-sm py-4'>${projectLocalAuthorityIndirectEconomicImpactsTotal > 0 ? "Bénéfice" : "Déficit"} du projet : <span class='font-bold'>${formatEvolutionPercentage(percentageComparison)}</span> par rapport aux dépenses d'équipement de la commune`,
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
          }}
          exportingOptions={{
            chartOptions: { xAxis: { lineWidth: 0 } },
            colors,
          }}
        />
      </div>
    </div>
  );
}
