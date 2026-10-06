import classNames from "@/shared/views/clsx";

import type { DevelopmentScoreDataView } from "../../../application/project-impacts/selectors/projectDevelopmentScore.selectors";
import { LETTER_GRADE_COLORS } from "./colors";

const ProjectDevelopmentGrade = (props: { score: DevelopmentScoreDataView["score"] }) => {
  const { bgColor, textColor } = LETTER_GRADE_COLORS[props.score.letterGrade];

  return (
    <span
      className={classNames(
        "text-lg w-10 h-10 p-1.5 inline-block text-center rounded-full shrink-0 font-bold",
        bgColor,
        textColor,
      )}
    >
      {props.score.letterGradeWithModifiers}
    </span>
  );
};

export default ProjectDevelopmentGrade;
