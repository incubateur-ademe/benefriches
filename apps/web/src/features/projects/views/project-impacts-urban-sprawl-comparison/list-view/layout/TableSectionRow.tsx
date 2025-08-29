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
  "py-1",
  "px-2",
  "border-0",
  "border-solid",
  "border-borderGrey",
  "dark:border-grey-dark",
  "border-t",
  "border-b",
];

const getColumnClasses = (hasValue: boolean, isSubSection: boolean) => {
  const bgColor = isSubSection
    ? "bg-[var(--background-contrast-grey)]"
    : "bg-[var(--background-disabled-grey)]";

  return {
    firstColumn: [...commonTdClasses, "w-8", bgColor, "rounded-tl", "border-l", "rounded-bl"],

    contentColumns: [...commonTdClasses, bgColor],

    valueColumns: [...commonTdClasses, "text-center", "w-44"],

    baseCaseColumn: [...commonTdClasses, hasValue ? "bg-[#F6F1E1] dark:bg-[#806922]" : bgColor],

    // Dernière colonne
    comparisonColumn: [
      ...commonTdClasses,
      hasValue ? "bg-[#F6E1F1] dark:bg-[#7F236B]" : bgColor,
      "rounded-br",
      "border-r",
      "rounded-tr",
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
            className={classNames("text-black dark:text-white")}
            iconId={isAccordionOpened ? "fr-icon-arrow-up-s-fill" : "fr-icon-arrow-down-s-fill"}
            onClick={onToggleAccordion}
            size="small"
            priority="tertiary no outline"
            title={isAccordionOpened ? "Fermer la section" : "Afficher la section"}
          />
        </td>
        <td
          className={classNames([
            "font-bold",
            !subSection && "text-lg",
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
            "font-bold",
          ])}
        >
          {baseValue ? formatValueFn(baseValue) : baseValue === 0 ? "-" : undefined}
        </td>
        <td
          className={classNames([
            columnClasses.valueColumns,
            columnClasses.comparisonColumn,
            comparisonValue && getPositiveNegativeTextClassesFromValue(comparisonValue),
            "font-bold",
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
