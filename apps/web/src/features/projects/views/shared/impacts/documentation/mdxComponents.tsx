import { fr } from "@codegouvfr/react-dsfr";
import CallOut, { type CallOutProps } from "@codegouvfr/react-dsfr/CallOut";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ElementType, ReactNode } from "react";
import type { LetterGradeWithModifier } from "shared";
import { getLetterGradeFromLetterGradeWithModifiers } from "shared";

import classNames from "@/shared/views/clsx";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { LETTER_GRADE_COLORS } from "../../../project-development-score/layout/colors";
import { getLetterGradeBadgeText } from "../../../project-development-score/layout/gradeLabels";
import { parseLetterGradeCell, textOf } from "./mdxHelpers";

/**
 * Conventions utilisées dans les .mdx :
 * - `> ℹ️ ...` `> ⚠️ ...` `> ✅ ...` `> 📌 ...` `> ❌ ...`  → CallOut (info / warning / success / neutral / error)
 * - cellule de tableau commençant par `➕` / `➖` / `±`     → badge Bénéfice / Coût / Variable
 */

/** "🏗️ Bilan d'exploitation" → "bilan-d-exploitation" (sert d'ancre pour les liens `#...`) */
export const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const CALLOUT_VARIANTS: Record<string, CallOutProps["colorVariant"]> = {
  ℹ: "blue-ecume",
  "⚠": "yellow-moutarde",
  "✅": "green-menthe",
  "📌": "beige-gris-galet",
  "❌": "pink-tuile",
};

const SIGN_STYLES: [string, string][] = [
  ["➕", "bg-green-100 text-success-ultradark"],
  ["➖", "bg-red-100 text-error-ultradark"],
  ["±", "bg-gray-100"],
];

export const heading =
  (Tag: ElementType, className: string) =>
  ({ children }: { children?: ReactNode }) => (
    <Tag id={slugify(textOf(children))} className={classNames("scroll-mt-20", className)}>
      {children}
    </Tag>
  );

const GradeBadge = ({ letterGrade }: { letterGrade: LetterGradeWithModifier }) => {
  const { textColor, bgColor } =
    LETTER_GRADE_COLORS[getLetterGradeFromLetterGradeWithModifiers(letterGrade)];

  return (
    <span
      className={classNames(
        "text-lg w-8 h-8 p-0.5 inline-block text-center rounded-full shrink-0 font-bold",
        bgColor,
        textColor,
      )}
    >
      {letterGrade}
    </span>
  );
};

const Td = ({ children, className }: ComponentProps<"td">) => (
  <td className={classNames("p-3 bg-none border-b border-border-grey", className)}>{children}</td>
);

const TdLetterGrade = ({ children, className }: ComponentProps<"td">) => {
  const parsed = parseLetterGradeCell(textOf(children).trim());

  if (!parsed) {
    return <Td className={className}>{children}</Td>;
  }

  const { gradeWithModifier, labelKind } = parsed;
  const letterGrade = getLetterGradeFromLetterGradeWithModifiers(gradeWithModifier);

  return (
    <Td
      className={classNames(
        "whitespace-nowrap w-[1%]",
        labelKind ? "min-w-1/3" : "text-center",
        LETTER_GRADE_COLORS[letterGrade].bgLightColor,
        className,
      )}
    >
      <GradeBadge letterGrade={gradeWithModifier} />
      {labelKind && (
        <span className="font-bold pl-3">{getLetterGradeBadgeText(labelKind, letterGrade)}</span>
      )}
    </Td>
  );
};

export const commonMdxComponents: MDXComponents = {
  a: ({ href = "", children }: ComponentProps<"a">) =>
    href.startsWith("http") ? (
      <ExternalLink href={href}>{children as string}</ExternalLink>
    ) : (
      <a href={href}>{children}</a>
    ),

  blockquote: ({ children }: ComponentProps<"blockquote">) => {
    const firstChar = Array.from(textOf(children).trimStart())[0];
    return (
      <CallOut
        className="my-4 p-6"
        colorVariant={firstChar ? CALLOUT_VARIANTS[firstChar] : undefined}
      >
        {children}
      </CallOut>
    );
  },

  code: ({ children }: ComponentProps<"code">) => (
    <code className="bg-(--background-contrast-grey) block my-2 p-2 text-sm rounded-lg border">
      {children}
    </code>
  ),

  table: ({ children }: ComponentProps<"table">) => (
    <div className={fr.cx("fr-table", "fr-table--no-caption", "fr-table--multiline")}>
      <div className="fr-table__container">
        <div className="fr-table__content">
          <table>{children}</table>
        </div>
      </div>
    </div>
  ),

  thead: ({ children }: ComponentProps<"thead">) => (
    <thead className="after:bg-none">{children}</thead>
  ),

  tbody: ({ children }: ComponentProps<"tbody">) => (
    <tbody className="after:bg-none">{children}</tbody>
  ),

  th: ({ children }: ComponentProps<"th">) => (
    <th className="p-3 uppercase bg-(--background-contrast-grey) border-b-text-light">
      {children}
    </th>
  ),

  td: Td,
};

export const developmentScoreMdxComponents: MDXComponents = {
  ...commonMdxComponents,
  Metrics: () => null,
  h1: heading("h1", "text-2xl font-bold mb-4"),
  h2: heading("h2", "text-xl font-semibold my-4"),
  h3: heading("h3", "text-lg font-semibold my-4"),
  h4: heading("h4", "text-base font-bold my-3"),
  h5: heading("h5", "text-base font-semibold my-3"),

  td: TdLetterGrade,
};

export const documentationMdxComponents: MDXComponents = {
  // Niveaux décalés d'un cran : le <h1> de la page est dans ImpactDocumentation.tsx
  ...developmentScoreMdxComponents,

  h1: heading("h3", "text-2xl font-bold mb-4"),
  h2: heading("h4", "text-xl font-semibold mt-6 mb-3"),
  h3: heading("h5", "text-lg font-semibold mt-2 mb-2"),
  h4: heading("h6", "text-base font-bold mt-2 mb-2"),
  h5: heading("span", "text-base font-semibold mt-2 mb-2"),

  td: ({ children }: ComponentProps<"td">) => {
    const text = textOf(children).trim();
    const sign = SIGN_STYLES.find(([prefix]) => text.startsWith(prefix));

    return (
      <TdLetterGrade className="p-3 bg-none border-b border-border-grey">
        {sign ? (
          <span
            className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-sm font-medium ${sign[1]}`}
          >
            {children}
          </span>
        ) : (
          children
        )}
      </TdLetterGrade>
    );
  },
};
