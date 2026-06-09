import { formatMonetaryImpact } from "../../shared/formatImpactValue";
import ComparisonCell from "./ComparisonCell";

type ComparisonRowProps = {
  label: React.ReactNode;
  projectValue: number;
  scenarioValue: number;
  labelBold?: boolean;
  totalRow?: boolean;
};

export default function ComparisonMonetaryRow({
  label,
  projectValue,
  scenarioValue,
  labelBold,
  totalRow,
}: ComparisonRowProps) {
  return (
    <>
      <ComparisonCell
        firstCol
        bold={labelBold || totalRow}
        size={totalRow ? "lg" : "md"}
        className="h-28"
      >
        {label}
      </ComparisonCell>
      <ComparisonCell bold={totalRow} value={projectValue}>
        {formatMonetaryImpact(projectValue)}
      </ComparisonCell>
      <ComparisonCell bold={totalRow} value={scenarioValue}>
        {formatMonetaryImpact(scenarioValue)}
      </ComparisonCell>
    </>
  );
}
