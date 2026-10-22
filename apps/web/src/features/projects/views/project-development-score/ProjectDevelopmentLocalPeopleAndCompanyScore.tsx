import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import { getLabelForBuildingsUse } from "@/shared/core/urbanProject";

import type { DevelopmentScoreDataView } from "../../application/project-impacts/selectors/projectDevelopmentScore.selectors";
import useOpenDescriptionModalLink from "./details-modals/useOpenDescriptionModalLink";
import MetricCard from "./layout/ProjectDevelopmentMetricCard";
import ProjectDevelopmentScoreFamilyHeader from "./layout/ProjectDevelopmentScoreFamilyHeader";

type Props =
  DevelopmentScoreDataView["developmentScore"]["details"]["localPeopleQualityOfLifeScore"] & {
    anchor: string;
  };

const listFormatter = new Intl.ListFormat("fr", {
  style: "long",
  type: "conjunction",
});

export default function ProjectDevelopmentLocalPeopleAndCompanyScore({
  score,
  indicators,
  anchor,
}: Props) {
  const getLink = useOpenDescriptionModalLink();

  if (score.gradePoints === 0) {
    return null;
  }
  return (
    <div className="grid md:grid-cols-3 gap-6 relative">
      <ProjectDevelopmentScoreFamilyHeader
        anchor={anchor}
        title="Qualité de vie des riverains"
        score={score}
        linkProps={getLink("localPeopleQualityOfLifeScore")}
      />

      <div className=" md:col-span-2 grid md:grid-cols-2 gap-4">
        {indicators.livingEnvironment ? (
          <MetricCard
            title="Cadre de vie"
            emoji="🌳"
            description="Grâce à la reconversion de la friche."
            letterGrade={indicators.livingEnvironment.letterGrade}
            linkProps={getLink("localPeopleQualityOfLifeScore.livingEnvironment")}
          />
        ) : null}

        {indicators.localHealthiness.applies && indicators.localHealthiness.letterGrade ? (
          <MetricCard
            title="Santé"
            emoji="🫀"
            letterGrade={indicators.localHealthiness.letterGrade}
            linkProps={getLink("localPeopleQualityOfLifeScore.localHealthiness")}

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
            linkProps={getLink("localPeopleQualityOfLifeScore.trafficSecurity")}
          />
        ) : null}

        {indicators.fricheAccidents.applies && indicators.fricheAccidents.letterGrade ? (
          <MetricCard
            title="Sécurité des riverains"
            emoji="💥"
            letterGrade={indicators.fricheAccidents.letterGrade}
            description="Grâce à la reconversion et la sécurisation de la friche."
            linkProps={getLink("localPeopleQualityOfLifeScore.frichesAccidents")}
          />
        ) : null}

        {indicators.accessToHealthCare.applies && indicators.accessToHealthCare.letterGrade ? (
          <MetricCard
            title="Accès aux soins"
            emoji="🏥"
            letterGrade={indicators.accessToHealthCare.letterGrade}
            linkProps={getLink("localPeopleQualityOfLifeScore.accessToHealthCare")}

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
            linkProps={getLink("localPeopleQualityOfLifeScore.accessToLocalServices")}

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
