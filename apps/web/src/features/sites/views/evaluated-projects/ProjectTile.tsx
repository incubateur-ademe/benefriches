import { DevelopmentPlanType } from "shared";

import { getScenarioPictoUrl } from "@/features/projects/views/shared/scenarioType";
import classNames from "@/shared/views/clsx";
import { routes } from "@/shared/views/router";

type Props = {
  projectId: string;
  projectName: string;
  projectType: DevelopmentPlanType;
};

export default function EvaluatedProjectTile({ projectId, projectName, projectType }: Props) {
  return (
    <a {...routes.projectImpacts({ projectId }).link} className="bg-none">
      <div
        className={classNames(
          "flex flex-col h-full gap-2 items-center justify-center",
          "border border-border-grey rounded-lg p-8",
          "hover:bg-gray-50 dark:hover:bg-grey-dark",
        )}
      >
        <img
          src={getScenarioPictoUrl(projectType)}
          aria-hidden={true}
          alt=""
          width="80px"
          height="80px"
        />
        <h3 className="text-lg font-bold text-center">{projectName}</h3>
      </div>
    </a>
  );
}
