import { getMainImpactIndicatorCardContent } from "shared";

import { routes } from "@/app/router";
import classNames from "@/shared/views/clsx";

import type { ProjectSummaryDataView } from "../../application/project-impacts/selectors/projectSummary.selector";

type Props = Pick<ProjectSummaryDataView, "mainImpactIndicator"> & { projectId: string };

export default function ProjectSummaryComparisonCard({ mainImpactIndicator, projectId }: Props) {
  const content = mainImpactIndicator
    ? getMainImpactIndicatorCardContent(mainImpactIndicator)
    : undefined;

  return (
    <div className="border rounded-3xl p-6 flex flex-col justify-between">
      <div>
        <span
          className={classNames(
            "bg-success-ultralight",
            "text-[32px]",
            "p-2",
            "mb-4",
            "inline-flex",
            "text-[32px]/tight font-bold rounded-lg",
          )}
        >
          {content?.headline}
        </span>
        <h4 className={classNames("mb-4", "text-[32px]")}>{content?.title}</h4>
        <p>{content?.body}</p>
      </div>

      <div>
        <a className="fr-link" {...routes.projectAvoidedCostsAnalysis({ projectId }).link}>
          Voir l'analyse des coûts évités
        </a>
      </div>
    </div>
  );
}
