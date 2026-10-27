import { isValidElement, type ReactNode } from "react";
import type { LetterGradeWithModifier } from "shared";

import type { ScoreBadgeLabelKind } from "../../../project-development-score/layout/gradeLabels";

export const textOf = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
};

const LETTER_GRADE_CELL_REGEX = new RegExp(
  `^([ABCDE])([+-]|_(qualitative|evolution|impact|compliance))?$`,
);

export const parseLetterGradeCell = (text: string) => {
  const match = LETTER_GRADE_CELL_REGEX.exec(text);
  if (!match) return null;

  const [, letter, suffix, labelKind] = match;
  const hasModifier = suffix === "+" || suffix === "-";

  return {
    gradeWithModifier: (hasModifier ? `${letter}${suffix}` : letter) as LetterGradeWithModifier,
    labelKind: labelKind ? (labelKind as ScoreBadgeLabelKind) : undefined,
  };
};
