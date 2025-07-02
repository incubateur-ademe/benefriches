import { ReactNode, useState } from "react";

import ImpactComparisonTableRow from "./TableRow";

type Props = {
  baseValue: number;
  comparisonValue: number;
  label: string;
  actor?: string;
  children?: ReactNode;
  formatValueFn?: (value: number) => string;
};

const TableAccordionRow = ({
  label,
  actor,
  baseValue,
  comparisonValue,
  children,
  formatValueFn,
}: Props) => {
  const [isAccordionOpened, setIsAccordionOpened] = useState(false);
  const onToggleAccordion = () => {
    setIsAccordionOpened((current) => !current);
  };

  const hasDetails = children !== undefined;

  return (
    <>
      <ImpactComparisonTableRow
        label={label}
        actor={actor}
        isFirst
        isLast={!isAccordionOpened}
        accordion={hasDetails ? { isOpened: isAccordionOpened, onToggleAccordion } : undefined}
        baseValue={baseValue}
        comparisonValue={comparisonValue}
        formatValueFn={formatValueFn}
      />

      {isAccordionOpened && children}
    </>
  );
};

export default TableAccordionRow;
