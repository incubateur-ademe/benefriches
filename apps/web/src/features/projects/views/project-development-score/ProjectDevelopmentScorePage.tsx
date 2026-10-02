import type { ReactNode } from "react";
import { Fragment } from "react";
import type { LetterGrade } from "shared";

import classNames from "@/shared/views/clsx";

import type { DevelopmentScoreDataView } from "../../application/project-impacts/selectors/projectDevelopmentScore.selectors";
import BreakEvenLevelImpactsActionBar from "../project-break-even-level/ProjectBreakEvenLevelActionBar";
import ProjectPageHeader from "../project-page/header";
import ProjectDevelopmentEnvironmentScore from "./ProjectDevelopmentEnvironmentScore";
import ProjectDevelopmentFullTimeJobsScore from "./ProjectDevelopmentFullTimeJobsScore";
import ProjectDevelopmentGrade from "./ProjectDevelopmentGrade";
import ProjectDevelopmentLocalAuthorityFinancesScore from "./ProjectDevelopmentLocalAuthorityFinancesScore";
import ProjectDevelopmentLocalPeopleAndCompanyScore from "./ProjectDevelopmentLocalPeopleAndCompanyScore";
import GradeScale from "./ProjectDevelopmentScoreGradeScale";
import { LETTER_GRADE_COLORS } from "./colors";

const getLetterGradeText = (letterGrade: LetterGrade) => {
  switch (letterGrade) {
    case "A":
      return "Projet à impact très positif";
    case "B":
      return "Projet à impact positif";
    case "C":
      return "Projet à impact insuffisant";
    case "D":
      return "Projet à impact négatif";
    case "E":
      return "Projet à impact très négatif";
  }
};

const isPositiveGrade = (grade: LetterGrade) => grade === "A" || grade === "B";

function buildHighlightSentence(
  grade: LetterGrade,
  items: {
    letterGrade: LetterGrade;
    highlightLabel: ReactNode;
  }[],
): React.ReactNode | null {
  const isPositive = isPositiveGrade(grade);
  const labels = items
    .filter((item) => isPositiveGrade(item.letterGrade) === isPositive)
    .map((item) => item.highlightLabel);

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
  onEvaluationPeriodChange: (value: number) => void;
};

export default function ProjectDevelopmentScore({
  projectId,
  details,
  score,
  evaluationPeriodInYears,
  onEvaluationPeriodChange,
}: Props) {
  const {
    localAuthorityEconomicScore,
    localPeopleQualityOfLifeScore,
    fullTimeJobsScore,
    environmentScore,
  } = details;

  const { bgColor, textColor } = LETTER_GRADE_COLORS[score.letterGrade];

  const highlightSentence = buildHighlightSentence(score.letterGrade, [
    {
      highlightLabel: (
        <>
          les <strong>finances publiques</strong>
        </>
      ),
      letterGrade: localAuthorityEconomicScore.score.letterGrade,
    },
    {
      highlightLabel: (
        <>
          l'<strong>emploi</strong>
        </>
      ),
      letterGrade: fullTimeJobsScore.score.letterGrade,
    },
    {
      highlightLabel: (
        <>
          la <strong>qualité de vie des riverains</strong>
        </>
      ),
      letterGrade: localPeopleQualityOfLifeScore.score.letterGrade,
    },
    {
      highlightLabel: (
        <>
          l'<strong>environnement</strong>
        </>
      ),
      letterGrade: environmentScore.score.letterGrade,
    },
  ]);

  return (
    <div className="flex flex-col gap-14">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl mb-0">Score d'impact</h3>
        <BreakEvenLevelImpactsActionBar
          evaluationPeriod={evaluationPeriodInYears}
          onEvaluationPeriodChange={onEvaluationPeriodChange}
          header={<ProjectPageHeader projectId={projectId} />}
        />
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
          <h4 className="mb-0">{getLetterGradeText(score.letterGrade)}</h4>
          {highlightSentence && <p className="mt-1 opacity-90">{highlightSentence}</p>}
        </div>

        <div className="md:col-span-2 highcharts-no-xaxis flex flex-col gap-6">
          <GradeScale projectScore={score} />

          <ul className="list-none flex flex-col gap-6 pl-0">
            <li className="flex justify-between items-center">
              <span className="flex flex-col">
                <strong className="text-lg">Finances de la collectivité locale</strong>
                <span>
                  Le projet a un impact économique{" "}
                  {localAuthorityEconomicScore.score.letterGrade === "A" ||
                  localAuthorityEconomicScore.score.letterGrade === "B"
                    ? "positif"
                    : localAuthorityEconomicScore.score.letterGrade === "C"
                      ? "neutre"
                      : "négatif"}{" "}
                  pour la collectivité`
                </span>
              </span>
              <ProjectDevelopmentGrade score={localAuthorityEconomicScore.score} />
            </li>
            <li className="flex justify-between items-center">
              <span className="flex flex-col">
                <strong className="text-lg">Emploi</strong>
                <span>
                  {fullTimeJobsScore.score.letterGrade === "D"
                    ? "Le projet supprime des emplois"
                    : fullTimeJobsScore.score.letterGrade === "C"
                      ? "Le projet ne créé pas ou peu d'emplois"
                      : "Le projet créé des emplois"}
                </span>
              </span>
              <ProjectDevelopmentGrade score={fullTimeJobsScore.score} />
            </li>
            <li className="flex justify-between items-center">
              <span className="flex flex-col">
                <strong className="text-lg">Qualité de vie des riverains</strong>
                <span>
                  {localPeopleQualityOfLifeScore.score.letterGrade === "A" ||
                  localPeopleQualityOfLifeScore.score.letterGrade === "B"
                    ? "Le projet améliore le quotidien de nombreuses personnes"
                    : localPeopleQualityOfLifeScore.score.letterGrade === "C"
                      ? "Le projet n'a pas d'impact positif sur le quotidien des riverains"
                      : "Le projet a pas un impact négatif sur le quotidien des riverains"}
                </span>
              </span>
              <ProjectDevelopmentGrade score={localPeopleQualityOfLifeScore.score} />
            </li>
            <li className="flex justify-between items-center">
              <span className="flex flex-col">
                <strong className="text-lg">Environnement</strong>
                <span>
                  Le projet{" "}
                  {environmentScore.score.letterGrade === "A" ||
                  environmentScore.score.letterGrade === "B"
                    ? "préserve ou améliore"
                    : environmentScore.score.letterGrade === "C"
                      ? "n'a pas d'impact significatif sur"
                      : "a un impact néfaste sur"}{" "}
                  l'environnement
                </span>
              </span>
              <ProjectDevelopmentGrade score={environmentScore.score} />
            </li>
          </ul>
        </div>
      </div>

      {localAuthorityEconomicScore.details.localAuthorityFinances && (
        <ProjectDevelopmentLocalAuthorityFinancesScore {...localAuthorityEconomicScore} />
      )}

      <ProjectDevelopmentFullTimeJobsScore {...fullTimeJobsScore} />

      <ProjectDevelopmentLocalPeopleAndCompanyScore {...localPeopleQualityOfLifeScore} />

      <ProjectDevelopmentEnvironmentScore {...environmentScore} />

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
