import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { routes } from "@/app/router";
import { impactsExportModalOpened } from "@/features/analytics/core/analyticsEvents";
import { eventTracked } from "@/features/analytics/core/eventTracked.action";
import classNames from "@/shared/views/clsx";

import { evaluationPeriodUpdated } from "../../application/project-impacts/actions";
import { selectImpactsPageViewData } from "../../application/project-impacts/selectors/projectImpacts.selectors";
import type { ProjectSummaryDataView } from "../../application/project-impacts/selectors/projectSummary.selector";
import BreakEvenLevalImpactsActionBar from "../project-break-even-level/ProjectBreakEvenLevelActionBar";
import ProjectBreakEvenLevelSummary from "../project-break-even-level/ProjectBreakEvenLevelSummary";
import ProjectDevelopmentMainScoreHighlightText from "../project-development-score/ProjectDevelopmentMainScoreHighlightText";
import { LETTER_GRADE_COLORS } from "../project-development-score/layout/colors";
import { MAIN_GRADE_TEXT } from "../project-development-score/layout/gradeLabels";
import ExportImpactsModal from "../project-impacts/export-impacts/ExportModal";
import ProjectImpactFooter from "../project-page/footer/ProjectImpactFooter";
import ProjectPageHeader from "../project-page/header/";
import ProjectSummaryComparisonCard from "./ProjectSummaryComparisonCard";
import { ProjectSummaryMap } from "./ProjectSummaryMap";

type Props = ProjectSummaryDataView & { projectId: string };

export default function ProjectSummaryTab({
  projectId,
  projectionYears,
  breakEvenYear,
  developmentScore,
  mainImpactIndicator,
  projectContext,
  siteAddress,
  siteName,
  siteId,
}: Props) {
  const dispatch = useAppDispatch();
  const { evaluationPeriod = 50 } = useAppSelector(selectImpactsPageViewData);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl mb-0">Aperçu</h3>
        <BreakEvenLevalImpactsActionBar
          evaluationPeriod={evaluationPeriod}
          onEvaluationPeriodChange={(evaluationPeriodInYears: number) => {
            void dispatch(evaluationPeriodUpdated(evaluationPeriodInYears));
          }}
          header={<ProjectPageHeader projectId={projectId} />}
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {siteAddress.lat && siteAddress.long && (
          <div className="border rounded-3xl">
            <ProjectSummaryMap
              lat={siteAddress.lat}
              long={siteAddress.long}
              addressLabel={siteAddress.label}
              siteName={siteName}
              siteId={siteId}
            />
          </div>
        )}

        <div className="border rounded-3xl p-6  flex flex-col justify-between">
          <div>
            <span
              className={classNames(
                "text-4xl w-16 h-16 p-3 mb-4 inline-block rounded-full text-center shrink-0 whitespace-nowrap  font-bold",
                LETTER_GRADE_COLORS[developmentScore.score.letterGrade].bgColor,
                LETTER_GRADE_COLORS[developmentScore.score.letterGrade].textColor,
              )}
            >
              {developmentScore.score.letterGradeWithModifiers}
            </span>
            <h4 className="text-[32px] mb-4">
              {MAIN_GRADE_TEXT[developmentScore.score.letterGrade]}
            </h4>
            <ProjectDevelopmentMainScoreHighlightText developmentScore={developmentScore} />
          </div>

          <div>
            <a className="fr-link" {...routes.projectImpactsDevelopmentScore({ projectId }).link}>
              Voir le détail du score
            </a>
          </div>
        </div>

        <div className="border rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <ProjectBreakEvenLevelSummary
              classes={{ title: "text-[32px]" }}
              breakEvenYear={breakEvenYear}
              projectionYears={projectionYears}
              compact
            />
          </div>

          <div>
            <a className="fr-link" {...routes.projectImpactsBreakEvenLevel({ projectId }).link}>
              Voir l'analyse coût-bénéfices
            </a>
          </div>
        </div>

        <ProjectSummaryComparisonCard
          projectId={projectId}
          mainImpactIndicator={mainImpactIndicator}
        />
      </div>

      <ProjectImpactFooter
        siteId={siteId}
        projectId={projectId}
        isUpdateEnabled={projectContext.isUrban && !projectContext.isDemo}
        onExportModalOpened={() => void dispatch(eventTracked(impactsExportModalOpened()))}
      />
      <ExportImpactsModal projectId={projectId} siteId={siteId} />
    </div>
  );
}
