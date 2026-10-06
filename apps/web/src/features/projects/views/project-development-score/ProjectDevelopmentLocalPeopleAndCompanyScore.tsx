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

export default function ProjectDevelopmentLocalPeopleAndCompanyScore({ score, details }: Props) {
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
        {details.livingEnvironment ? (
          <MetricCard
            title="Cadre de vie"
            emoji="🌳"
            description="Grâce à la reconversion de la friche."
            letterGrade={details.livingEnvironment.letterGrade}
          />
        ) : null}

        {details.localHealthiness ? (
          <MetricCard
            title="Santé"
            emoji="🫀"
            letterGrade={details.localHealthiness.letterGrade}
            description={
              <>
                Grâce à{" "}
                {listFormatter.format(
                  [
                    {
                      text: "la création d'espaces de nature",
                      display: details.localHealthiness.metrics.newGreenSoilSurfaces > 0,
                    },
                    {
                      text: "la dépollution des sols de la friche",
                      display: details.localHealthiness.metrics.siteReconversionType === "friche",
                    },
                    {
                      text: "la création d'équipement sportif",
                      display: details.localHealthiness.metrics.sportsFacilitiesFloorSurface > 0,
                    },
                  ]
                    .filter(({ display }) => display)
                    .map(({ text }) => text),
                )}
                .
              </>
            }
          />
        ) : null}

        {details.trafficSecurity ? (
          <MetricCard
            title="Sécurité routière"
            emoji="🚙"
            letterGrade={details.trafficSecurity.letterGrade}
            description="Grâce à la réduction de la distance entre les habitations et l’établissement éducatif."
          />
        ) : null}

        {details.frichesAccidents ? (
          <MetricCard
            title="Sécurité des riverains"
            emoji="💥"
            letterGrade={details.frichesAccidents.letterGrade}
            description="Grâce à la reconversion et la sécurisation de la friche."
          />
        ) : null}

        {details.accessToHealthCare ? (
          <MetricCard
            title="Accès aux soins"
            emoji="🏥"
            letterGrade={details.accessToHealthCare.letterGrade}
            description={
              <>
                Grâce à la création de{" "}
                {listFormatter.format(
                  details.accessToHealthCare.metrics.matchingBuildingsUses.map(
                    (item) =>
                      `${formatSurfaceArea(item.floorSurfaceArea)} de ${getLabelForBuildingsUse(item.buildingUse)}`,
                  ),
                )}
                .
              </>
            }
          />
        ) : null}

        {details.accessToLocalServices ? (
          <MetricCard
            title="Accès aux services de proximité"
            emoji="🏪"
            letterGrade={details.accessToLocalServices.letterGrade}
            description={
              <>
                Grâce à la création de{" "}
                {listFormatter.format(
                  details.accessToLocalServices.metrics.matchingBuildingsUses.map(
                    (item) =>
                      `${formatSurfaceArea(item.floorSurfaceArea)} de ${getLabelForBuildingsUse(item.buildingUse)}`,
                  ),
                )}
                .
              </>
            }
          />
        ) : null}
      </div>
    </div>
  );
}
