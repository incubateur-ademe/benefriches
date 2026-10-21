import type { Link } from "type-route";

import type { DevelopmentScoreDataView } from "@/features/projects/application/project-impacts/selectors/projectDevelopmentScore.selectors";

import ProjectDevelopmentGrade from "./ProjectDevelopmentGrade";

export default ({
  score,
  linkProps,
  anchor,
  title,
}: {
  anchor: string;
  title: string;
  score: DevelopmentScoreDataView["developmentScore"]["score"];
  linkProps: Link;
}) => {
  return (
    <div id={anchor} className="scroll-mt-32 group">
      <h4>{title}</h4>
      <ProjectDevelopmentGrade score={score} />

      <a {...linkProps} className="text-sm mx-6 invisible group-hover:visible group-focus:visible">
        Comment le score est-il calculé ?
      </a>
    </div>
  );
};
