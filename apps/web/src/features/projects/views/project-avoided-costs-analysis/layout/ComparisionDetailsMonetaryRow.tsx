import ComparisonMonetaryRow from "./ComparisonMonetaryRow";

const ComparisionDetailsMonetaryRow = ({
  label,
  left,
  right,
}: {
  label: string;
  left: number;
  right: number;
}) => {
  if (left === 0 && right === 0) return null;
  return (
    <ComparisonMonetaryRow label={label} labelBold projectValue={left} scenarioValue={right} />
  );
};

export default ComparisionDetailsMonetaryRow;
