import { ReactNode, useMemo } from "react";
import { renderToString } from "react-dom/server";

import classNames from "@/shared/views/clsx";

import { DevelopmentScoreDataView } from "../../application/project-impacts/projectDevelopmentScore.selectors";
import BreakEvenLevelImpactsActionBar from "../project-break-even-level/ProjectBreakEvenLevelActionBar";
import EconomicColumnChart from "../project-break-even-level/charts/EconomicColumnChart";
import LocalAuthorityIndirectEconomicImpactsCharts from "../project-break-even-level/charts/LocalAuthorityIndirectEconomicImpactsCharts";
import ProjectPageHeader from "../project-page/header";
import ProjectDevelopmentEnvironmentScore from "./ProjectDevelopmentEnvironmentScore";
import ProjectDevelopmentFullTimeJobsScore from "./ProjectDevelopmentFullTimeJobsScore";
import IconFail from "./ProjectDevelopmentIconFail";
import IconSuccess from "./ProjectDevelopmentIconSuccess";
import ProjectDevelopmentLocalPeopleAndCompanyScore from "./ProjectDevelopmentLocalPeopleAndCompanyScore";
import GradeScale, { Grade, GRADE_CONFIGS, GradeConfig } from "./ProjectDevelopmentScoreGradeScale";

type ScoreItem = {
  title: string;
  description: string;
  isSuccess: boolean;
  highlightLabel: ReactNode;
};
function getGrade(failureCount: number): Grade {
  if (failureCount === 0) return "A";
  if (failureCount === 1) return "B";
  if (failureCount === 2) return "C";
  if (failureCount === 3) return "D";
  return "E";
}

function getGradeConfig(grade: Grade): GradeConfig {
  return GRADE_CONFIGS.find((g) => g.label === grade)!;
}

function buildHighlightSentence(grade: Grade, items: ScoreItem[]): React.ReactNode | null {
  const isPositiveGrade = grade === "A" || grade === "B";
  const labels = items
    .filter((item) => (isPositiveGrade ? item.isSuccess : !item.isSuccess))
    .map((item) => item.highlightLabel);

  if (labels.length === 0) return null;

  const parts = labels.map((label, i) => {
    const isLast = i === labels.length - 1;
    const isSecondToLast = i === labels.length - 2;
    const separator = isLast ? "" : isSecondToLast ? " et " : ", ";

    return (
      <span key={renderToString(label)}>
        {label}
        {separator}
      </span>
    );
  });

  return <>Notamment sur {parts}.</>;
}

type Props = DevelopmentScoreDataView & {
  projectId: string;
  onEvaluationPeriodChange: (value: number) => void;
};

export default function ProjectDevelopmentScore({
  projectId,
  macroEconomicScore,
  localAuthorityEconomicScore,
  localPeopleAndCompanyScore,
  environmentScore,
  fullTimeJobsScore,
  evaluationPeriodInYears,
  onEvaluationPeriodChange,
}: Props) {
  const scoreItems: ScoreItem[] = useMemo(
    () => [
      {
        title: "Finances de la collectivité locale",
        highlightLabel: (
          <>
            les <strong>finances publiques</strong>
          </>
        ),
        isSuccess: localAuthorityEconomicScore.isSuccess,
        description: `Le projet a un impact économique ${localAuthorityEconomicScore.isSuccess ? "positif" : "négatif"} pour la collectivité`,
      },
      {
        title: "Emploi",
        highlightLabel: (
          <>
            l'<strong>emploi</strong>
          </>
        ),
        isSuccess: fullTimeJobsScore.isSuccess,
        description: fullTimeJobsScore.isSuccess
          ? "Le projet créé des emplois"
          : "Le projet ne crée pas d'emploi ou en supprime",
      },
      {
        title: "Qualité de vie des riverains",
        highlightLabel: (
          <>
            la <strong>qualité de vie des riverains</strong>
          </>
        ),
        isSuccess: localPeopleAndCompanyScore.isSuccess,
        description: localPeopleAndCompanyScore.isSuccess
          ? "Le projet améliore le quotidien de nombreuses personnes"
          : "Le projet n'a pas d'impact positif sur le quotidien des riverains",
      },
      {
        title: "Environnement",
        highlightLabel: (
          <>
            l'<strong>environnement</strong>
          </>
        ),
        isSuccess: environmentScore.isSuccess,
        description: `Le projet ${environmentScore.isSuccess ? "préserve ou améliore" : "a un impact néfaste sur"} l'environnement`,
      },
      {
        title: "Macroéconomie",
        highlightLabel: (
          <>
            la <strong>macroéconomie</strong>
          </>
        ),

        isSuccess: macroEconomicScore.isSuccess,
        description: `Le projet a un impact économique ${macroEconomicScore.isSuccess ? "positif" : "négatif"} pour les riverains et la société`,
      },
    ],
    [
      macroEconomicScore,
      environmentScore,
      localPeopleAndCompanyScore,
      fullTimeJobsScore,
      localAuthorityEconomicScore,
    ],
  );

  const failureCount = scoreItems.filter(
    (item) => !item.isSuccess && item.title !== "Macroéconomie",
  ).length;
  const grade = getGrade(failureCount);
  const config = getGradeConfig(grade);
  const highlightSentence = buildHighlightSentence(grade, scoreItems);

  return (
    <div className="flex flex-col gap-14">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl mb-0">Aménage’score</h3>
        <BreakEvenLevelImpactsActionBar
          evaluationPeriod={evaluationPeriodInYears}
          onEvaluationPeriodChange={onEvaluationPeriodChange}
          header={<ProjectPageHeader projectId={projectId} />}
        />
      </div>

      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <div className="flex flex-col gap-4 items-start">
            <span
              className={classNames(
                "text-4xl rounded-full px-4 py-2 shrink-0 text-white font-bold",
                config.bgColor,
              )}
            >
              {grade}
            </span>
            <h4 className="mb-0">{config.summary}</h4>
            {highlightSentence && <p className="mt-1 opacity-90">{highlightSentence}</p>}
          </div>
        </div>

        <div className="md:col-start-5 md:col-span-8 highcharts-no-xaxis flex flex-col gap-6">
          <GradeScale currentGrade={grade} />

          <ul className="list-none flex flex-col gap-6 pl-0">
            {scoreItems.map((item) => (
              <li key={item.title} className="flex justify-between items-center">
                <span className="flex flex-col">
                  <strong className="text-lg">{item.title}</strong>
                  <span>{item.description}</span>
                </span>
                {item.isSuccess ? <IconSuccess /> : <IconFail />}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <h4>Finances de la collectivité locale</h4>
          {localAuthorityEconomicScore.isSuccess ? <IconSuccess /> : <IconFail />}
        </div>

        <div className="md:col-start-5 md:col-span-8 highcharts-no-xaxis">
          <LocalAuthorityIndirectEconomicImpactsCharts
            localAuthorityIndirectEconomicImpacts={{
              total: localAuthorityEconomicScore.value,
              details: localAuthorityEconomicScore.metrics,
            }}
          />
        </div>
      </div>

      <ProjectDevelopmentFullTimeJobsScore fullTimeJobsScore={fullTimeJobsScore} />

      <ProjectDevelopmentLocalPeopleAndCompanyScore
        localPeopleAndCompanyScore={localPeopleAndCompanyScore}
      />

      <ProjectDevelopmentEnvironmentScore environmentScore={environmentScore} />

      <div className="grid md:grid-cols-12 gap-12">
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
                y: macroEconomicScore.metrics.local_people_or_company.total,
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
      </div>
    </div>
  );
}
