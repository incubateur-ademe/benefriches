import type { LetterGrade } from "shared";

import type { DevelopmentScoreDataView } from "../../application/project-impacts/selectors/projectDevelopmentScore.selectors";
import ImpactChartCard from "../shared/charts/ImpactChartCard";
import useImpactAreaChartProps from "../shared/charts/useImpactAreaChartProps";
import ProjectDevelopmentGrade from "./ProjectDevelopmentGrade";
import MetricCard from "./ProjectDevelopmentMetricCard";

type Props = DevelopmentScoreDataView["details"]["environmentScore"];

const listFormatter = new Intl.ListFormat("fr", { style: "long", type: "conjunction" });

function formatReasons(reasons: { text: string; when: boolean }[]): string | null {
  const texts = reasons.filter((reason) => reason.when).map((reason) => reason.text);
  return texts.length > 0 ? listFormatter.format(texts) : null;
}

const buildGradeDescription = (props: {
  grade: LetterGrade;
  positiveReasons: { text: string; when: boolean }[];
  neutralText: string;
  negativeReasons: { text: string; when: boolean }[];
}): string | null => {
  const { grade, negativeReasons, positiveReasons, neutralText } = props;
  if (grade === "A" || grade === "B") {
    const reasons = formatReasons(positiveReasons);
    return reasons && `Grâce à ${reasons}.`;
  }
  if (grade === "C") return neutralText;

  const reasons = formatReasons(negativeReasons);
  return reasons && `À cause de ${reasons}.`;
};

type Details = Props["details"];

const describeZanCompliance = ({ letterGrade, metrics }: NonNullable<Details["zanCompliance"]>) =>
  buildGradeDescription({
    grade: letterGrade,
    neutralText: "Pas ou peu de changement sur les surfaces perméables",
    positiveReasons: [
      { text: "la création d'espaces de nature", when: metrics.newGreenSoilSurfaces > 0 },
      {
        text: "la dépollution des sols de la friche",
        when: metrics.siteReconversionType === "friche",
      },
      {
        text: "la création de nouvelles surfaces perméables",
        when: metrics.permeableSurfaceDifference.difference > 0,
      },
    ],
    negativeReasons: [
      { text: "la destruction d'espaces de nature", when: metrics.newGreenSoilSurfaces < 0 },
      {
        text: "la consommation d'espaces naturels ou agricoles",
        when: metrics.siteReconversionType !== "friche",
      },
      {
        text: "la destruction de surfaces perméables",
        when: metrics.permeableSurfaceDifference.difference < 0,
      },
    ],
  });

const describeSoilsQuality = ({ letterGrade, metrics }: NonNullable<Details["soilsQuality"]>) =>
  buildGradeDescription({
    grade: letterGrade,
    neutralText: "Pas ou peu de changement sur les surfaces perméables et la pollution",
    positiveReasons: [
      { text: "la dépollution des sols de la friche", when: metrics.contamination.difference > 0 },
      {
        text: "la création de nouvelles surfaces perméables",
        when: metrics.permeableSurfaceDifference.difference > 0,
      },
    ],
    negativeReasons: [
      {
        text: "la pollution toujours présente sur les sols de la friche",
        when:
          metrics.contamination.siteContaminatedSurface > 0 &&
          metrics.contamination.difference === 0,
      },
      {
        text: "la destruction de surfaces perméables",
        when: metrics.permeableSurfaceDifference.difference < 0,
      }, // était > 0
    ],
  });

const describeWaterQuality = ({ letterGrade, metrics }: NonNullable<Details["waterQuality"]>) =>
  buildGradeDescription({
    grade: letterGrade,
    neutralText:
      "Pas ou peu de changement sur la pollution et les surfaces naturelles ou agricoles",
    positiveReasons: [
      { text: "la dépollution des sols de la friche", when: metrics.contamination.difference > 0 },
      {
        text: "la création de nouvelles surfaces agricoles",
        when: metrics.agriculturalSurfaceDifference > 0,
      },
      { text: "la création de forêt", when: metrics.forestSurfaceDifference > 0 },
      { text: "la création de prairie", when: metrics.prairieSurfaceDifference > 0 },
      {
        text: "la création de nouvelles zones humides",
        when: metrics.wetLandSurfaceDifference > 0,
      },
    ],
    negativeReasons: [
      {
        text: "la pollution des sols de la friche",
        when:
          metrics.contamination.difference === 0 &&
          metrics.contamination.siteContaminatedSurface > 0,
      },
      {
        text: "la destruction de surfaces agricoles",
        when: metrics.agriculturalSurfaceDifference < 0,
      },
      { text: "la destruction de forêt", when: metrics.forestSurfaceDifference < 0 },
      { text: "la destruction de prairie", when: metrics.prairieSurfaceDifference < 0 },
      { text: "la destruction de zones humides", when: metrics.wetLandSurfaceDifference < 0 },
    ],
  });

const describeEcosystemServices = (grade: LetterGrade) => {
  if (grade === "A" || grade === "B")
    return "Le projet a des impacts positifs sur les services écosystémiques.";
  if (grade === "C") return "Le projet a des impacts neutres sur les services écosystémiques.";
  return "Le projet a des impacts négatifs sur les services écosystémiques.";
};

const ZAN_BADGE_TEXT: Record<Props["score"]["letterGrade"], string> = {
  A: "Très favorable",
  B: "Favorable",
  C: "Neutre",
  D: "Défavorable",
  E: "Très défavorable",
};

const CO2_CHART_TITLE = "☁️ CO2 eq stocké ou évité";

export default function ProjectDevelopmentEnvironmentScore({ score, details }: Props) {
  const { co2eqEmissionsVariation, zanCompliance, soilsQuality, waterQuality, ecosystemServices } =
    details;

  const { avoidedCo2eqEmissions, siteStatuQuoStoredCo2Eq, newStoredCo2Eq } =
    co2eqEmissionsVariation?.metrics ?? {
      avoidedCo2eqEmissions: 0,
      siteStatuQuoStoredCo2Eq: 0,
      newStoredCo2Eq: 0,
    };

  const { options, colors, chartContainerId } = useImpactAreaChartProps({
    title: CO2_CHART_TITLE,
    type: "co2",
    color: "#CAD3DB",
    base: siteStatuQuoStoredCo2Eq,
    forecast: siteStatuQuoStoredCo2Eq + newStoredCo2Eq + avoidedCo2eqEmissions,
    difference: avoidedCo2eqEmissions + newStoredCo2Eq,
  });

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div>
        <h4>Environnement</h4>
        <ProjectDevelopmentGrade score={score} />
      </div>

      <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
        {co2eqEmissionsVariation && (
          <div className="md:col-span-2">
            <ImpactChartCard
              title={CO2_CHART_TITLE}
              exportingOptions={{ colors, colorBySeries: true }}
              containerProps={{ id: chartContainerId }}
              options={options}
              classes={{ title: "text-xl" }}
            />
          </div>
        )}

        {zanCompliance && (
          <MetricCard
            emoji="🌱"
            title="Objectif ZAN"
            badgeText={ZAN_BADGE_TEXT[zanCompliance.letterGrade]}
            letterGrade={zanCompliance.letterGrade}
            description={describeZanCompliance(zanCompliance)}
          />
        )}

        {soilsQuality && (
          <MetricCard
            emoji="🌾"
            title="Qualité des sols"
            letterGrade={soilsQuality.letterGrade}
            description={describeSoilsQuality(soilsQuality)}
          />
        )}

        {waterQuality && (
          <MetricCard
            emoji="🚰"
            title="Qualité de l'eau"
            letterGrade={waterQuality.letterGrade}
            description={describeWaterQuality(waterQuality)}
          />
        )}

        {ecosystemServices && (
          <MetricCard
            emoji="🐸"
            title="Services écosystémiques"
            letterGrade={ecosystemServices.letterGrade}
            description={describeEcosystemServices(ecosystemServices.letterGrade)}
          />
        )}
      </div>
    </div>
  );
}
