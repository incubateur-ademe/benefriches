import Button from "@codegouvfr/react-dsfr/Button";

import { getPositiveNegativeTextClassesFromValue } from "@/shared/views/classes/positiveNegativeTextClasses";
import classNames from "@/shared/views/clsx";

import { formatMonetaryImpact } from "../../../shared/formatImpactValue";

type Props = {
  baseValue: number;
  comparisonValue: number;
  label: string;
  actor?: string;
  accordion?: {
    isOpened: boolean;
    onToggleAccordion: () => void;
  };
  isFirst?: boolean;
  isLast?: boolean;
  formatValueFn?: (value: number) => string;
};

const commonTdClasses = [
  "px-2",
  "py-1",
  "border-0",
  "border-solid",
  "border-border-grey",
  "dark:border-grey-dark",
];

const columnClasses = {
  firstColumn: [...commonTdClasses, "w-8", "bg-white", "dark:bg-black", "border-l"],

  contentColumns: [...commonTdClasses, "bg-white", "dark:bg-black"],

  valueColumns: [...commonTdClasses, "text-center", "w-44"],

  baseCaseColumn: [...commonTdClasses, "bg-[#F9F6EB] dark:bg-[#806922]"],

  comparisonColumn: [...commonTdClasses, "bg-[#F9EBF6] dark:bg-[#7F236B]", "border-r"],
};

const borderClasses = {
  firstRow: {
    all: ["border-t"],
    firstCol: ["border-t", "border-l", "rounded-tl"],
    lastCol: ["border-t", "border-r", "rounded-tr"],
  },

  lastRow: {
    firstCol: ["border-l", "rounded-bl"],
    all: ["border-b"],
    lastCol: ["rounded-br", "border-r"],
  },
};

const ImpactComparisonTableRow = ({
  label,
  actor,
  baseValue,
  comparisonValue,
  accordion,
  isFirst = false,
  isLast = false,
  formatValueFn = formatMonetaryImpact,
}: Props) => {
  return (
    <tr>
      <td
        className={classNames([
          columnClasses.firstColumn,
          accordion && "pb-1! pt-1!",
          isFirst && [borderClasses.firstRow.all, borderClasses.firstRow.firstCol],
          isLast && [borderClasses.lastRow.all, borderClasses.lastRow.firstCol],
        ])}
      >
        {accordion ? (
          <Button
            className={classNames("text-black dark:text-white", "text-xl")}
            iconId={accordion.isOpened ? "fr-icon-arrow-up-s-fill" : "fr-icon-arrow-down-s-fill"}
            onClick={accordion.onToggleAccordion}
            size="small"
            priority="tertiary no outline"
            title={accordion.isOpened ? "Fermer la section" : "Afficher la section"}
          />
        ) : undefined}
      </td>
      <td
        className={classNames([
          isFirst && "font-bold py-2",
          isLast && "pb-2",
          columnClasses.contentColumns,
          isFirst && borderClasses.firstRow.all,
          isLast && borderClasses.lastRow.all,
        ])}
      >
        {label}
      </td>
      <td
        className={classNames([
          columnClasses.contentColumns,
          isFirst && borderClasses.firstRow.all,
          isLast && borderClasses.lastRow.all,
          "text-left",
          "min-w-48",
          "pr-6",
        ])}
      >
        {actor}
      </td>
      <td
        className={classNames([
          columnClasses.valueColumns,
          columnClasses.baseCaseColumn,
          isFirst && borderClasses.firstRow.all,
          isLast && borderClasses.lastRow.all,
          getPositiveNegativeTextClassesFromValue(baseValue),
          isFirst && "font-bold",
        ])}
      >
        {baseValue ? formatValueFn(baseValue) : "-"}
      </td>
      <td
        className={classNames([
          columnClasses.valueColumns,
          columnClasses.comparisonColumn,
          isFirst && [borderClasses.firstRow.all, borderClasses.firstRow.lastCol],
          isLast && [borderClasses.lastRow.all, borderClasses.lastRow.lastCol],
          getPositiveNegativeTextClassesFromValue(comparisonValue),
          isFirst && "font-bold",
        ])}
      >
        {comparisonValue ? formatValueFn(comparisonValue) : "-"}
      </td>
    </tr>
  );
};

export default ImpactComparisonTableRow;
