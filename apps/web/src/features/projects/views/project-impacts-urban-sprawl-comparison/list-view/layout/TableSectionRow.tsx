import Button from "@codegouvfr/react-dsfr/Button";
import { ReactNode, useMemo, useState } from "react";

import { getPositiveNegativeTextClassesFromValue } from "@/shared/views/classes/positiveNegativeTextClasses";
import classNames from "@/shared/views/clsx";

import { formatMonetaryImpact } from "../../../shared/formatImpactValue";
import ImpactComparisonTableSeparatorRow from "./TableSeparatorRow";

type Props = {
  baseValue?: number;
  comparisonValue?: number;
  label: string;
  children: ReactNode;
  subSection?: boolean;
  formatValueFn?: (value: number) => string;
};

const commonTdClasses = [
  "tw-py-1",
  "tw-px-2",
  "tw-border-0",
  "tw-border-solid",
  "tw-border-borderGrey",
  "dark:tw-border-grey-dark",
  "tw-border-t",
  "tw-border-b",
];

const getColumnClasses = (hasValue: boolean, isSubSection: boolean) => {
  const bgColor = isSubSection
    ? "tw-bg-[var(--background-contrast-grey)]"
    : "tw-bg-[var(--background-disabled-grey)]";

  return {
    firstColumn: [
      ...commonTdClasses,
      "tw-w-8",
      bgColor,
      "tw-rounded-tl",
      "tw-border-l",
      "tw-rounded-bl",
    ],

    contentColumns: [...commonTdClasses, bgColor],

    valueColumns: [...commonTdClasses, "tw-text-center", "tw-w-44"],

    baseCaseColumn: [
      ...commonTdClasses,
      hasValue ? "tw-bg-[#F6F1E1] dark:tw-bg-[#806922]" : bgColor,
    ],

    // Dernière colonne
    comparisonColumn: [
      ...commonTdClasses,
      hasValue ? "tw-bg-[#F6E1F1] dark:tw-bg-[#7F236B]" : bgColor,
      "tw-rounded-br",
      "tw-border-r",
      "tw-rounded-tr",
    ],
  };
};

const TableSectionRow = ({
  label,
  baseValue,
  comparisonValue,
  children,
  subSection = false,
  formatValueFn = formatMonetaryImpact,
}: Props) => {
  const [isAccordionOpened, setIsAccordionOpened] = useState(true);
  const onToggleAccordion = () => {
    setIsAccordionOpened((current) => !current);
  };

  const columnClasses = useMemo(
    () => getColumnClasses(baseValue !== undefined && comparisonValue !== undefined, subSection),
    [baseValue, comparisonValue, subSection],
  );

  return (
    <>
      <tr>
        <td className={classNames(columnClasses.firstColumn)}>
          <Button
            className={classNames("tw-text-black dark:tw-text-white")}
            iconId={isAccordionOpened ? "fr-icon-arrow-up-s-fill" : "fr-icon-arrow-down-s-fill"}
            onClick={onToggleAccordion}
            size="small"
            priority="tertiary no outline"
            title={isAccordionOpened ? "Fermer la section" : "Afficher la section"}
          />
        </td>
        <td
          className={classNames([
            "tw-font-bold",
            !subSection && "tw-text-lg",
            columnClasses.contentColumns,
          ])}
        >
          {label}
        </td>
        <td className={classNames([columnClasses.contentColumns])}></td>
        <td
          className={classNames([
            columnClasses.valueColumns,
            columnClasses.baseCaseColumn,
            baseValue && getPositiveNegativeTextClassesFromValue(baseValue),
            "tw-font-bold",
          ])}
        >
          {baseValue ? formatValueFn(baseValue) : baseValue === 0 ? "-" : undefined}
        </td>
        <td
          className={classNames([
            columnClasses.valueColumns,
            columnClasses.comparisonColumn,
            comparisonValue && getPositiveNegativeTextClassesFromValue(comparisonValue),
            "tw-font-bold",
          ])}
        >
          {comparisonValue
            ? formatValueFn(comparisonValue)
            : comparisonValue === 0
              ? "-"
              : undefined}
        </td>
      </tr>

      <ImpactComparisonTableSeparatorRow size={subSection ? "small" : "large"} />

      {isAccordionOpened && children}
      <ImpactComparisonTableSeparatorRow size={subSection ? "middle" : "large"} />
    </>
  );
};

export default TableSectionRow;
