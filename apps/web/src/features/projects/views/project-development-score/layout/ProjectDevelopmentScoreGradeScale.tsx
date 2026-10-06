import type { LetterGrade, ProjectDevelopmentScore } from "shared";

import classNames from "@/shared/views/clsx";

import { LETTER_GRADE_COLORS } from "./colors";

const LETTER_GRADES = ["A", "B", "C", "D", "E"] as const satisfies LetterGrade[];

export default function GradeScale({
  projectScore,
}: {
  projectScore: ProjectDevelopmentScore["score"];
}) {
  return (
    <div className="grid grid-cols-5 text-center font-bold text-2xl pb-4">
      {LETTER_GRADES.map((letterGrade, index, array) => {
        const isFirst = index === 0;
        const isLast = index === array.length - 1;
        const isActive = projectScore.letterGrade === letterGrade;

        const { bgColor, textColor } = LETTER_GRADE_COLORS[letterGrade];

        return (
          <div className="flex flex-col" key={letterGrade}>
            <span
              className={classNames(
                `w-full h-2 ${bgColor}`,
                isActive && `${bgColor} ${textColor}`,
                isFirst ? (isActive ? "rounded-tl-lg" : "rounded-l-lg") : "",
                isLast ? (isActive ? "rounded-tr-lg" : "rounded-r-lg") : "",
              )}
            ></span>
            <span
              key={letterGrade}
              className={classNames(
                "leading-16 rounded-b-lg",
                isActive && `${bgColor} ${textColor}`,
              )}
            >
              {isActive ? projectScore.letterGradeWithModifiers : letterGrade}
            </span>
          </div>
        );
      })}
    </div>
  );
}
