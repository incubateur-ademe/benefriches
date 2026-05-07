import { DevelopmentScoreDataView } from "../../application/project-impacts/projectDevelopmentScore.selectors";
import ImpactChartCard from "../project-page/impacts/charts-view/ImpactChartCard/ImpactChartCard";
import useImpactAreaChartProps from "../shared/charts/useImpactAreaChartProps";
import IconFail from "./ProjectDevelopmentIconFail";
import IconSuccess from "./ProjectDevelopmentIconSuccess";
import MetricCard from "./ProjectDevelopmentMetricCard";

type Props = Pick<DevelopmentScoreDataView, "environmentScore">;

const listFormatter = new Intl.ListFormat("fr", {
  style: "long",
  type: "conjunction",
});

export default function ProjectDevelopmentEnvironmentScore({ environmentScore }: Props) {
  const { options, colors, chartContainerId } = useImpactAreaChartProps({
    title: "☁️ CO2 eq stocké ou évité",
    type: "co2",
    color: "#CAD3DB",
    base: environmentScore.metrics?.avoidedCo2eqEmissions?.base ?? 0,
    forecast: environmentScore.metrics?.avoidedCo2eqEmissions?.forecast ?? 0,
    difference: environmentScore.metrics?.avoidedCo2eqEmissions?.difference ?? 0,
  });

  const soilAndWaterReasons = [
    {
      text: "la désimperméabilisation",
      display:
        environmentScore.metrics.permeableSurfaceAreaDifference &&
        environmentScore.metrics.permeableSurfaceAreaDifference > 0,
    },
    {
      text: "la dépollution des sols",
      display: environmentScore.metrics.hasDecontamination,
    },
  ]
    .filter(({ display }) => display)
    .map(({ text }) => text);

  const hasSoilOrWaterImpact =
    environmentScore.metrics.hasDecontamination ||
    (environmentScore.metrics.permeableSurfaceAreaDifference &&
      environmentScore.metrics.permeableSurfaceAreaDifference > 0);

  return (
    <div className="grid md:grid-cols-12 gap-12">
      <div className="md:col-span-4">
        <h4>Environnement</h4>
        {environmentScore.isSuccess ? <IconSuccess /> : <IconFail />}
      </div>

      <div className="md:col-start-5 md:col-span-8 grid md:grid-cols-2 gap-4">
        {environmentScore.metrics.avoidedCo2eqEmissions && (
          <div className="col-span-2">
            <ImpactChartCard
              title="☁️ CO2 eq stocké ou évité"
              exportingOptions={{ colors, colorBySeries: true }}
              containerProps={{
                id: chartContainerId,
              }}
              options={options}
              classes={{ title: "text-xl" }}
            />
          </div>
        )}

        {environmentScore.metrics.zanCompliance !== undefined && (
          <MetricCard
            emoji="🌱"
            title="Objectif ZAN"
            isPositive={environmentScore.metrics.zanCompliance}
            badge={environmentScore.metrics.zanCompliance ? "Favorable" : "Défavorable"}
            description={
              environmentScore.metrics.zanCompliance
                ? "Grâce à la non-consommation d'espace naturel ou agricole."
                : "À cause de la consommation d'espace naturel ou agricole."
            }
          />
        )}

        {hasSoilOrWaterImpact && (
          <MetricCard
            emoji="🌾"
            title="Qualité des sols"
            badge="Améliorée"
            isPositive={true}
            description={<>Grâce à {listFormatter.format(soilAndWaterReasons)}.</>}
          />
        )}

        {hasSoilOrWaterImpact && (
          <MetricCard
            emoji="🚰"
            badge="Améliorée"
            title="Qualité de l'eau"
            isPositive={true}
            description={<>Grâce à {listFormatter.format(soilAndWaterReasons)}.</>}
          />
        )}

        {environmentScore.metrics.avoidedVehiculeKilometers && (
          <MetricCard
            emoji="💨"
            title="Qualité de l'air"
            badge="Améliorée"
            isPositive={true}
            description="Grâce aux déplacements en voiture évités."
          />
        )}

        {environmentScore.metrics.ecosystemicServices && (
          <MetricCard
            emoji="🐸"
            title="Services écosystémiques"
            isPositive={environmentScore.metrics.ecosystemicServices > 0}
            badge={environmentScore.metrics.ecosystemicServices > 0 ? "Améliorés" : "Dégradés"}
            description={
              environmentScore.metrics.ecosystemicServices > 0
                ? "Le projet a des impacts positifs sur les services écosystémiques."
                : "Le projet a des impacts négatifs sur les services écosystémiques."
            }
          />
        )}
      </div>
    </div>
  );
}
