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
  "tw-px-2",
  "tw-py-1",
  "tw-border-0",
  "tw-border-solid",
  "tw-border-borderGrey",
  "dark:tw-border-grey-dark",
];

const columnClasses = {
  firstColumn: [...commonTdClasses, "tw-w-8", "tw-bg-white", "dark:tw-bg-black", "tw-border-l"],

  contentColumns: [...commonTdClasses, "tw-bg-white", "dark:tw-bg-black"],

  valueColumns: [...commonTdClasses, "tw-text-center", "tw-w-44"],

  baseCaseColumn: [...commonTdClasses, "tw-bg-[#F9F6EB] dark:tw-bg-[#806922]"],

  comparisonColumn: [...commonTdClasses, "tw-bg-[#F9EBF6] dark:tw-bg-[#7F236B]", "tw-border-r"],
};

const borderClasses = {
  firstRow: {
    all: ["tw-border-t"],
    firstCol: ["tw-border-t", "tw-border-l", "tw-rounded-tl"],
    lastCol: ["tw-border-t", "tw-border-r", "tw-rounded-tr"],
  },

  lastRow: {
    firstCol: ["tw-border-l", "tw-rounded-bl"],
    all: ["tw-border-b"],
    lastCol: ["tw-rounded-br", "tw-border-r"],
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
          accordion && "!tw-pb-1 !tw-pt-1",
          isFirst && [borderClasses.firstRow.all, borderClasses.firstRow.firstCol],
          isLast && [borderClasses.lastRow.all, borderClasses.lastRow.firstCol],
        ])}
      >
        {accordion ? (
          <Button
            className={classNames("tw-text-black dark:tw-text-white", "tw-text-xl")}
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
          isFirst && "tw-font-bold tw-py-2",
          isLast && "tw-pb-2",
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
          "tw-text-left",
          "tw-min-w-48",
          "tw-pr-6",
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
          isFirst && "tw-font-bold",
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
          isFirst && "tw-font-bold",
        ])}
      >
        {comparisonValue ? formatValueFn(comparisonValue) : "-"}
      </td>
    </tr>
  );
};

export default ImpactComparisonTableRow;
