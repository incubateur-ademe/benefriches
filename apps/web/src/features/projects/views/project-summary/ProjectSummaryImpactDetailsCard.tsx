import { getZanComplianceCardContent } from "shared";

import { routes } from "@/app/router";
import classNames from "@/shared/views/clsx";

import type { ProjectSummaryDataView } from "../../application/project-impacts/selectors/projectSummary.selector";

type Props = Pick<ProjectSummaryDataView, "zanCompliance"> & {
  projectId: string;
};

export default function ProjectSummaryImpactDetailsCard({ zanCompliance, projectId }: Props) {
  if (!zanCompliance) {
    return null;
  }

  const { headline, body } = getZanComplianceCardContent(zanCompliance);

  if (zanCompliance.isSuccess) {
    return (
      <div className="border rounded-3xl p-6  flex flex-col justify-between">
        <div>
          <span
            aria-hidden="true"
            className={classNames(
              "fr-icon-checkbox-circle-fill",
              "fr-icon",
              "before:[--icon-size:3rem]",
              "text-success-dark",
              "before:mb-6",
            )}
          ></span>
          <h4 className="text-[32px] mb-4">{headline}</h4>
          <p>{body}</p>
        </div>

        <div>
          <a className="fr-link" {...routes.projectImpacts({ projectId }).link}>
            Voir le détail des impacts
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-3xl p-6  flex flex-col justify-between">
      <div>
        <span
          className={classNames(
            "fr-icon-warning-fill",
            "fr-icon",
            "before:[--icon-size:3rem]",
            "text-error-ultradark",
            "before:mb-5 before:mt-1",
          )}
        ></span>
        <h4 className="mb-4 text-[32px]">{headline}</h4> <p>{body}</p>
      </div>

      <div>
        <a className="fr-link" {...routes.projectImpacts({ projectId }).link}>
          Voir le détail des impacts
        </a>
      </div>
    </div>
  );
}
