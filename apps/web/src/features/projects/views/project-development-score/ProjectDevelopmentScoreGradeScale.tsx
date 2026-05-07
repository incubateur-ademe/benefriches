import classNames, { ClassValue } from "@/shared/views/clsx";

export type Grade = "A" | "B" | "C" | "D" | "E";

export type GradeConfig = {
  label: Grade;
  bgColor: ClassValue;
  failThreshold: number;
  summary: string;
};

export const GRADE_CONFIGS = [
  {
    label: "A",
    failThreshold: 0,
    summary: "Projet à impact très positif",
    bgColor: "bg-development-score-grade-a",
  },
  {
    label: "B",
    failThreshold: 1,
    summary: "Projet à impact positif",
    bgColor: "bg-development-score-grade-b",
  },
  {
    label: "C",
    failThreshold: 2,
    summary: "Projet à impact insuffisant",
    bgColor: "bg-development-score-grade-c",
  },
  {
    label: "D",
    failThreshold: 3,
    summary: "Projet à impact négatif",
    bgColor: "bg-development-score-grade-d",
  },
  {
    label: "E",
    failThreshold: 4,
    summary: "Projet à impact très négatif",
    bgColor: "bg-development-score-grade-e",
  },
] as const;

export default function GradeScale({ currentGrade }: { currentGrade: Grade }) {
  return (
    <div className="grid grid-cols-5 text-center font-bold text-2xl pb-4">
      {GRADE_CONFIGS.map(({ label, bgColor }, index) => {
        const isFirst = index === 0;
        const isLast = index === GRADE_CONFIGS.length - 1;
        const isActive = label === currentGrade;

        return (
          <div className="flex flex-col" key={label}>
            <span
              className={classNames(
                `w-full h-2 ${bgColor}`,
                isActive && `${bgColor} text-white`,
                isFirst ? (isActive ? "rounded-tl-lg" : "rounded-l-lg") : "",
                isLast ? (isActive ? "rounded-tr-lg" : "rounded-r-lg") : "",
              )}
            ></span>
            <span
              key={label}
              className={classNames("leading-16 rounded-b-lg", isActive && `${bgColor} text-white`)}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
