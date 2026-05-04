import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { routes } from "@/app/router";
import { impactsExportModalOpened } from "@/features/analytics/core/analyticsEvents";
import { eventTracked } from "@/features/analytics/core/eventTracked.action";

import { evaluationPeriodUpdated } from "../../application/project-impacts/actions";
import { ProjectSummaryDataView } from "../../application/project-impacts/projectSummary.selector";
import { selectImpactsPageViewData } from "../../core/projectImpacts.selectors";
import BreakEvenLevalImpactsActionBar from "../project-break-even-level/ProjectBreakEvenLevelActionBar";
import ProjectBreakEvenLevelSummary from "../project-break-even-level/ProjectBreakEvenLevelSummary";
import ExportImpactsModal from "../project-page/export-impacts/ExportModal";
import ProjectImpactFooter from "../project-page/footer/ProjectImpactFooter";
import ProjectPageHeader from "../project-page/header/";
import ProjectSummaryComparisonCard from "./ProjectSummaryComparisonCard";
import ProjectSummaryImpactDetailsCard from "./ProjectSummaryImpactDetailsCard";
import { ProjectSummaryMap } from "./ProjectSummaryMap";

type Props = ProjectSummaryDataView & { projectId: string };

export default function ProjectSummaryTab({
  projectId,
  projectionYears,
  breakEvenYear,
  zanCompliance,
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
            void dispatch(evaluationPeriodUpdated({ evaluationPeriodInYears }));
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

        <ProjectSummaryImpactDetailsCard zanCompliance={zanCompliance} projectId={projectId} />

        <div className="border rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <ProjectBreakEvenLevelSummary
              classes={{ title: "text-[32px]" }}
              breakEvenYear={breakEvenYear}
              projectionYears={projectionYears}
            />
          </div>

          <div>
            <a className="fr-link" {...routes.projectImpactsBreakEvenLevel({ projectId }).link}>
              Voir l'analyse coût-bénéfice
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
