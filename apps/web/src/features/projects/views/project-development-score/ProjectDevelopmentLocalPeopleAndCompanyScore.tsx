import type { Link } from "type-route";

import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import { getLabelForBuildingsUse } from "@/shared/core/urbanProject";

import type { DevelopmentScoreDataView } from "../../application/project-impacts/selectors/projectDevelopmentScore.selectors";
import type { DetailsName } from "./details-modals/useOpenDescriptionModalLink";
import MetricCard from "./layout/ProjectDevelopmentMetricCard";
import ProjectDevelopmentScoreFamilyHeader from "./layout/ProjectDevelopmentScoreFamilyHeader";

type Props =
  DevelopmentScoreDataView["developmentScore"]["details"]["localPeopleQualityOfLifeScore"] & {
    anchor: string;
    getLink: (details: DetailsName) => Link;
  };

const listFormatter = new Intl.ListFormat("fr", {
  style: "long",
  type: "conjunction",
});

type Indicator =
  keyof DevelopmentScoreDataView["developmentScore"]["details"]["localPeopleQualityOfLifeScore"]["indicators"];

export const localPeopleQualityOfLifeDescriptions = {
  livingEnvironment: "Grâce à la reconversion de la friche.",
  localHealthiness: (d) => {
    if (!d.localHealthiness?.metrics) {
      return undefined;
    }
    const { newGreenSoilSurfaces, siteReconversionType, sportsFacilitiesFloorSurface } =
      d.localHealthiness?.metrics ?? {};

    const labelsList = [
      {
        text: "la création d'espaces de nature",
        display: newGreenSoilSurfaces > 0,
      },
      {
        text: "la dépollution des sols de la friche",
        display: siteReconversionType === "friche",
      },
      {
        text: "la création d'équipement sportif",
        display: sportsFacilitiesFloorSurface > 0,
      },
    ]
      .filter(({ display }) => display)
      .map(({ text }) => text);

    return labelsList.length > 0 ? `Grâce à ${listFormatter.format(labelsList)}` : undefined;
  },
  trafficSecurity:
    "Grâce à la réduction de la distance entre les habitations et les commoditées créées.",
  fricheAccidents: "Grâce à la reconversion et la sécurisation de la friche.",
  accessToHealthCare: (d) => {
    if (!d.accessToHealthCare?.metrics) {
      return undefined;
    }
    const { matchingBuildingsUses } = d.accessToHealthCare?.metrics ?? {};

    const labelsList = matchingBuildingsUses.map(
      (item) =>
        `${formatSurfaceArea(item.floorSurfaceArea)} de ${getLabelForBuildingsUse(item.buildingUse)}`,
    );

    return labelsList.length > 0
      ? `Grâce à la création de ${listFormatter.format(labelsList)}`
      : undefined;
  },
  accessToLocalServices: (d) => {
    if (!d.accessToLocalServices?.metrics) {
      return undefined;
    }
    const { matchingBuildingsUses } = d.accessToLocalServices?.metrics ?? {};

    const labelsList = matchingBuildingsUses.map(
      (item) =>
        `${formatSurfaceArea(item.floorSurfaceArea)} de ${getLabelForBuildingsUse(item.buildingUse)}`,
    );

    return labelsList.length > 0
      ? `Grâce à la création de ${listFormatter.format(labelsList)}`
      : undefined;
  },
} as const satisfies Record<
  Indicator,
  | string
  | ((
      d: DevelopmentScoreDataView["developmentScore"]["details"]["localPeopleQualityOfLifeScore"]["indicators"],
    ) => string | undefined)
>;

export default function ProjectDevelopmentLocalPeopleAndCompanyScore({
  score,
  indicators,
  anchor,
  getLink,
}: Props) {
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
            description={localPeopleQualityOfLifeDescriptions.livingEnvironment}
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
            description={localPeopleQualityOfLifeDescriptions.localHealthiness(indicators)}
          />
        ) : null}

        {indicators.trafficSecurity.applies && indicators.trafficSecurity.letterGrade ? (
          <MetricCard
            title="Sécurité routière"
            emoji="🚙"
            letterGrade={indicators.trafficSecurity.letterGrade}
            description={localPeopleQualityOfLifeDescriptions.trafficSecurity}
            linkProps={getLink("localPeopleQualityOfLifeScore.trafficSecurity")}
          />
        ) : null}

        {indicators.fricheAccidents.applies && indicators.fricheAccidents.letterGrade ? (
          <MetricCard
            title="Sécurité des riverains"
            emoji="💥"
            letterGrade={indicators.fricheAccidents.letterGrade}
            description={localPeopleQualityOfLifeDescriptions.fricheAccidents}
            linkProps={getLink("localPeopleQualityOfLifeScore.frichesAccidents")}
          />
        ) : null}

        {indicators.accessToHealthCare.applies && indicators.accessToHealthCare.letterGrade ? (
          <MetricCard
            title="Accès aux soins"
            emoji="🏥"
            letterGrade={indicators.accessToHealthCare.letterGrade}
            linkProps={getLink("localPeopleQualityOfLifeScore.accessToHealthCare")}
            description={localPeopleQualityOfLifeDescriptions.accessToHealthCare(indicators)}
          />
        ) : null}

        {indicators.accessToLocalServices.applies &&
        indicators.accessToLocalServices.letterGrade ? (
          <MetricCard
            title="Accès aux services de proximité"
            emoji="🏪"
            letterGrade={indicators.accessToLocalServices.letterGrade}
            linkProps={getLink("localPeopleQualityOfLifeScore.accessToLocalServices")}
            description={localPeopleQualityOfLifeDescriptions.accessToLocalServices(indicators)}
          />
        ) : null}
      </div>
    </div>
  );
}
