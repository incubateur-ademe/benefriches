import { Fragment, useState } from "react";
import { typedObjectEntries, type LetterGrade } from "shared";
import type { Link, Route } from "type-route";

import { type routes, useRoute } from "@/app/router";
import classNames from "@/shared/views/clsx";

import type { DevelopmentScoreDataView } from "../../application/project-impacts/selectors/projectDevelopmentScore.selectors";
import ProjectPageHeader from "../project-page/header";
import ProjectDevelopmentEnvironmentScore from "./ProjectDevelopmentEnvironmentScore";
import ProjectDevelopmentFullTimeJobsScore from "./ProjectDevelopmentFullTimeJobsScore";
import ProjectDevelopmentLocalAuthorityFinancesScore from "./ProjectDevelopmentLocalAuthorityFinancesScore";
import ProjectDevelopmentLocalPeopleAndCompanyScore from "./ProjectDevelopmentLocalPeopleAndCompanyScore";
import DevelopmentScoreModalDescription from "./details-modals/DevelopmentScoreModalDescription";
import useOpenDescriptionModalLink from "./details-modals/useOpenDescriptionModalLink";
import ProjectDevelopmentGrade from "./layout/ProjectDevelopmentGrade";
import GradeScale from "./layout/ProjectDevelopmentScoreGradeScale";
import { LETTER_GRADE_COLORS } from "./layout/colors";

const GRADE_TEXT: Record<LetterGrade, string> = {
  A: "Projet à impact très positif",
  B: "Projet à impact positif",
  C: "Projet à impact insuffisant",
  D: "Projet à impact négatif",
  E: "Projet à impact très négatif",
};

const isPositive = (grade: LetterGrade) => grade === "A" || grade === "B";

const FAMILY_CONFIG = {
  localAuthorityEconomicScore: {
    order: 1,
    title: "Finances de la collectivité locale",
    anchor: "finances-publiques",
    highlightLabel: (
      <>
        les <strong>finances publiques</strong>
      </>
    ),
    getDescription: (grade: LetterGrade) => {
      if (isPositive(grade)) return "Le projet a un impact économique positif pour la collectivité";
      if (grade === "C") return "Le projet a un impact économique neutre pour la collectivité";
      return "Le projet a un impact économique négatif pour la collectivité";
    },
  },
  fullTimeJobsScore: {
    order: 2,
    anchor: "emploi",
    title: "Emploi",
    highlightLabel: (
      <>
        l'<strong>emploi</strong>
      </>
    ),
    getDescription: (grade: LetterGrade) => {
      if (grade === "D") return "Le projet supprime des emplois";
      if (grade === "C") return "Le projet ne crée pas ou peu d'emplois";
      return "Le projet crée des emplois";
    },
  },
  localPeopleQualityOfLifeScore: {
    order: 3,

    anchor: "qualite-de-vie",
    title: "Qualité de vie des riverains",
    highlightLabel: (
      <>
        la <strong>qualité de vie des riverains</strong>
      </>
    ),
    getDescription: (grade: LetterGrade) => {
      if (isPositive(grade)) return "Le projet améliore le quotidien de nombreuses personnes";
      if (grade === "C") return "Le projet n'a pas d'impact positif sur le quotidien des riverains";
      return "Le projet a un impact négatif sur le quotidien des riverains";
    },
  },
  environmentScore: {
    order: 4,

    anchor: "environnement",
    title: "Environnement",
    highlightLabel: (
      <>
        l'<strong>environnement</strong>
      </>
    ),
    getDescription: (grade: LetterGrade) => {
      if (isPositive(grade)) return "Le projet préserve ou améliore l'environnement";
      if (grade === "C") return "Le projet n'a pas d'impact significatif sur l'environnement";
      return "Le projet a un impact néfaste sur l'environnement";
    },
  },
} as const;

function buildHighlightSentence(
  developmentScore: Props["developmentScore"],
): React.ReactNode | null {
  const labels = typedObjectEntries(developmentScore.details)
    .filter(([, item]) => item.score.gradePoints > 50)
    .map(([key]) => FAMILY_CONFIG[key].highlightLabel);

  if (labels.length === 0) return null;

  return (
    <>
      Notamment sur{" "}
      {labels.map((label, i) => (
        <Fragment key={i}>
          {i > 0 && (i === labels.length - 1 ? " et " : ", ")}
          {label}
        </Fragment>
      ))}
      .
    </>
  );
}

type Props = DevelopmentScoreDataView & {
  projectId: string;
};

const FamilyScore = (props: {
  linkProps: Link;
  anchor: string;
  title: string;
  description: string;
  score: DevelopmentScoreDataView["developmentScore"]["score"];
}) => {
  return (
    <a
      href={`#${props.anchor}`}
      className={classNames(
        "group",
        "bg-none text-left",
        "rounded-lg hover:bg-grey-light focus:bg-grey-light",
        "px-1 py-2",
        "flex justify-between items-center",
      )}
    >
      <span className="flex flex-col">
        <strong className="text-lg">{props.title}</strong>
        <span>{props.description}</span>
      </span>
      <ProjectDevelopmentGrade score={props.score} />
    </a>
  );
};

export default function ProjectDevelopmentScore({
  projectId,
  developmentScore,
  modalsData,
}: Props) {
  const [isTitleInViewport, setIsTitleInViewPort] = useState(false);

  const route = useRoute() as Route<typeof routes.projectImpactsDevelopmentScore>;

  const { details, score } = developmentScore;

  const titleRef = (node: HTMLHeadingElement) => {
    const observer = new IntersectionObserver(([entry]) => {
      const entryIntersecting = entry?.isIntersecting ?? false;
      setIsTitleInViewPort(entryIntersecting);
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  };

  const {
    localAuthorityEconomicScore,
    localPeopleQualityOfLifeScore,
    fullTimeJobsScore,
    environmentScore,
  } = details;

  const { bgColor, textColor } = LETTER_GRADE_COLORS[score.letterGrade];
  const highlightSentence = buildHighlightSentence(developmentScore);

  const getLink = useOpenDescriptionModalLink();

  return (
    <div className="flex flex-col gap-14">
      <div className="flex items-center justify-between">
        <DevelopmentScoreModalDescription
          route={route}
          developmentScore={developmentScore}
          modalsData={modalsData}
        />
        <h3 className="text-2xl mb-0" ref={titleRef}>
          Score d'impact
        </h3>
        <span className="px-4 py-2 font-medium rounded-sm text-(--text-action-high-blue-france) shadow-[inset_0_0_0_1px_var(--border-action-high-blue-france)]">
          Durée : 50 ans
        </span>
        {!isTitleInViewport && (
          <div
            className={classNames(
              "bg-dsfr-grey",
              "shadow-md",
              "left-0",
              "z-30",
              "w-full",
              "fixed",
              "top-0",
              "py-4 md:p-4",
            )}
          >
            <ProjectPageHeader projectId={projectId} />
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-4 items-start">
          <span
            className={classNames(
              "text-5xl w-20 h-20 p-4 inline-block rounded-full text-center shrink-0 font-bold",
              bgColor,
              textColor,
            )}
          >
            {score.letterGrade}
          </span>
          <h4 className="mb-0">{GRADE_TEXT[score.letterGrade]}</h4>
          {highlightSentence && <p className="mt-1 opacity-90">{highlightSentence}</p>}
        </div>

        <div className="md:col-span-2 highcharts-no-xaxis flex flex-col gap-6">
          <GradeScale projectScore={score} />

          <ul className="list-none flex flex-col gap-2 pl-0">
            {typedObjectEntries(details)
              .toSorted((a, b) => FAMILY_CONFIG[a[0]].order - FAMILY_CONFIG[b[0]].order)
              .map(([key, item]) => (
                <li key={key}>
                  <FamilyScore
                    linkProps={getLink(key)}
                    description={FAMILY_CONFIG[key].getDescription(item.score.letterGrade)}
                    score={item.score}
                    anchor={FAMILY_CONFIG[key].anchor}
                    title={FAMILY_CONFIG[key].title}
                  />
                </li>
              ))}
          </ul>
        </div>
      </div>

      {localAuthorityEconomicScore.indicators.localAuthorityFinances && (
        <ProjectDevelopmentLocalAuthorityFinancesScore
          anchor={FAMILY_CONFIG.localAuthorityEconomicScore.anchor}
          linkProps={getLink("localAuthorityEconomicScore")}
          {...localAuthorityEconomicScore}
        />
      )}

      <ProjectDevelopmentFullTimeJobsScore
        anchor={FAMILY_CONFIG.fullTimeJobsScore.anchor}
        linkProps={getLink("fullTimeJobsScore")}
        {...fullTimeJobsScore}
      />

      <ProjectDevelopmentLocalPeopleAndCompanyScore
        anchor={FAMILY_CONFIG.localPeopleQualityOfLifeScore.anchor}
        {...localPeopleQualityOfLifeScore}
      />

      <ProjectDevelopmentEnvironmentScore
        anchor={FAMILY_CONFIG.environmentScore.anchor}
        {...environmentScore}
      />

      {/* <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <h4>Macroéconomie</h4>
          {macroEconomicScore.isSuccess ? <IconSuccess /> : <IconFail />}
        </div>

        <div className="md:col-start-5 md:col-span-8 highcharts-no-xaxis">
          <EconomicColumnChart
            title="💰 Impact économique pour les riverains et la société"
            legendText="Impact total pour les riverains et la société"
            legendTotal={macroEconomicScore.value}
            data={[
              {
                name: "Impact économique pour les riverains",
                y: macroEconomicScore.metrics.localPeopleOrCompany.total,
                color: "#038141",
              },
              {
                name: "Impact économique pour la société française et mondiale",
                y: macroEconomicScore.metrics.humanity.total,
                color: "#85BB2F40",
              },
            ]}
          />
        </div>
      </div> */}
    </div>
  );
}
