import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import { getLabelForBuildingsUse } from "@/shared/core/urbanProject";

import type { DevelopmentScoreDataView } from "../../application/project-impacts/selectors/projectDevelopmentScore.selectors";
import ProjectDevelopmentGrade from "./layout/ProjectDevelopmentGrade";
import MetricCard from "./layout/ProjectDevelopmentMetricCard";

type Props = DevelopmentScoreDataView["details"]["localPeopleQualityOfLifeScore"];

const listFormatter = new Intl.ListFormat("fr", {
  style: "long",
  type: "conjunction",
});

export default function ProjectDevelopmentLocalPeopleAndCompanyScore({ score, indicators }: Props) {
  if (score.gradePoints === 0) {
    return null;
  }
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div>
        <h4>Qualité de vie des riverains</h4>
        <ProjectDevelopmentGrade score={score} />
      </div>

      <div className=" md:col-span-2 grid md:grid-cols-2 gap-4">
        {indicators.livingEnvironment ? (
          <MetricCard
            title="Cadre de vie"
            emoji="🌳"
            description="Grâce à la reconversion de la friche."
            letterGrade={indicators.livingEnvironment.letterGrade}
          />
        ) : null}

        {indicators.localHealthiness.applies && indicators.localHealthiness.letterGrade ? (
          <MetricCard
            title="Santé"
            emoji="🫀"
            letterGrade={indicators.localHealthiness.letterGrade}
            description={
              indicators.localHealthiness.metrics && (
                <>
                  Grâce à{" "}
                  {listFormatter.format(
                    [
                      {
                        text: "la création d'espaces de nature",
                        display: indicators.localHealthiness.metrics.newGreenSoilSurfaces > 0,
                      },
                      {
                        text: "la dépollution des sols de la friche",
                        display:
                          indicators.localHealthiness.metrics.siteReconversionType === "friche",
                      },
                      {
                        text: "la création d'équipement sportif",
                        display:
                          indicators.localHealthiness.metrics.sportsFacilitiesFloorSurface > 0,
                      },
                    ]
                      .filter(({ display }) => display)
                      .map(({ text }) => text),
                  )}
                  .
                </>
              )
            }
          />
        ) : null}

        {indicators.trafficSecurity.applies && indicators.trafficSecurity.letterGrade ? (
          <MetricCard
            title="Sécurité routière"
            emoji="🚙"
            letterGrade={indicators.trafficSecurity.letterGrade}
            description="Grâce à la réduction de la distance entre les habitations et l’établissement éducatif."
          />
        ) : null}

        {indicators.fricheAccidents.applies && indicators.fricheAccidents.letterGrade ? (
          <MetricCard
            title="Sécurité des riverains"
            emoji="💥"
            letterGrade={indicators.fricheAccidents.letterGrade}
            description="Grâce à la reconversion et la sécurisation de la friche."
          />
        ) : null}

        {indicators.accessToHealthCare.applies && indicators.accessToHealthCare.letterGrade ? (
          <MetricCard
            title="Accès aux soins"
            emoji="🏥"
            letterGrade={indicators.accessToHealthCare.letterGrade}
            description={
              indicators.accessToHealthCare.metrics && (
                <>
                  Grâce à la création de{" "}
                  {listFormatter.format(
                    indicators.accessToHealthCare.metrics.matchingBuildingsUses.map(
                      (item) =>
                        `${formatSurfaceArea(item.floorSurfaceArea)} de ${getLabelForBuildingsUse(item.buildingUse)}`,
                    ),
                  )}
                  .
                </>
              )
            }
          />
        ) : null}

        {indicators.accessToLocalServices.applies &&
        indicators.accessToLocalServices.letterGrade ? (
          <MetricCard
            title="Accès aux services de proximité"
            emoji="🏪"
            letterGrade={indicators.accessToLocalServices.letterGrade}
            description={
              indicators.accessToLocalServices.metrics && (
                <>
                  Grâce à la création de{" "}
                  {listFormatter.format(
                    indicators.accessToLocalServices.metrics.matchingBuildingsUses.map(
                      (item) =>
                        `${formatSurfaceArea(item.floorSurfaceArea)} de ${getLabelForBuildingsUse(item.buildingUse)}`,
                    ),
                  )}
                  .
                </>
              )
            }
          />
        ) : null}
      </div>
    </div>
  );
}
