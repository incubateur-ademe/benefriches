import { DevelopmentScoreDataView } from "../../application/project-impacts/projectDevelopmentScore.selectors";
import IconFail from "./ProjectDevelopmentIconFail";
import IconSuccess from "./ProjectDevelopmentIconSuccess";
import MetricCard from "./ProjectDevelopmentMetricCard";

type Props = Pick<DevelopmentScoreDataView, "localPeopleAndCompanyScore">;

const listFormatter = new Intl.ListFormat("fr", {
  style: "long",
  type: "conjunction",
});

export default function ProjectDevelopmentLocalPeopleAndCompanyScore({
  localPeopleAndCompanyScore,
}: Props) {
  return (
    <div className="grid md:grid-cols-12 gap-12">
      <div className="md:col-span-4">
        <h4>Qualité de vie des riverains</h4>
        {localPeopleAndCompanyScore.isSuccess ? <IconSuccess /> : <IconFail />}
      </div>

      <div className="md:col-start-5 md:col-span-8 grid md:grid-cols-2 gap-4">
        {!localPeopleAndCompanyScore.isSuccess && (
          <p className="col-span-2">
            Le projet n'apporte pas d'impacts positifs sur le quotidien des riverains
          </p>
        )}
        {localPeopleAndCompanyScore.metrics.localPropertyValueIncrease && (
          <MetricCard
            title="Cadre de vie"
            emoji="🌳"
            badge="Amélioré"
            description="Grâce à la reconversion de la friche."
            isPositive={localPeopleAndCompanyScore.metrics.localPropertyValueIncrease > 0}
          />
        )}

        {(localPeopleAndCompanyScore.metrics.avoidedAirPollutionHealthExpenses ||
          localPeopleAndCompanyScore.metrics.hasDecontamination) && (
          <MetricCard
            title="Santé"
            emoji="🫀"
            isPositive={true}
            badge="Améliorée"
            description={
              <>
                Grâce à{" "}
                {listFormatter.format(
                  [
                    {
                      text: "la création d'espaces de nature en ville",
                      display: localPeopleAndCompanyScore.metrics.avoidedAirPollutionHealthExpenses,
                    },
                    {
                      text: "la dépollution des sols de la friche",
                      display: localPeopleAndCompanyScore.metrics.hasDecontamination,
                    },
                  ]
                    .filter(({ display }) => display)
                    .map(({ text }) => text),
                )}
                .
              </>
            }
          />
        )}
        {localPeopleAndCompanyScore.metrics.travelTimeSaved && (
          <MetricCard
            title="Temps libre"
            emoji="⏱"
            isPositive={true}
            badge="En hausse"
            description="Grâce au temps passé en moins dans les déplacements."
          />
        )}

        {localPeopleAndCompanyScore.metrics.avoidedTrafficAccidents && (
          <MetricCard
            title="Sécurité routière"
            emoji="🚙"
            isPositive={true}
            badge="Améliorée"
            description="Grâce à la réduction de la distance entre les habitations et l’établissement éducatif."
          />
        )}

        {localPeopleAndCompanyScore.metrics.avoidedFrichesAccidents && (
          <MetricCard
            title="Sécurité des riverains"
            emoji="💥"
            badge="Améliorée"
            isPositive={true}
            description="Grâce à la reconversion et la sécurisation de la friche."
          />
        )}
      </div>
    </div>
  );
}
