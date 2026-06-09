import { sumListWithKey } from "shared";

import {
  HumanityCategory,
  LocalAuthorityCategory,
  LocalPeopleOrCompanyCategory,
} from "@/features/projects/domain/groupIndirectImpactsByBearer";

import ComparisonMonetaryRow from "./ComparisonMonetaryRow";

type ImpactDetail = {
  name: LocalPeopleOrCompanyCategory | HumanityCategory | LocalAuthorityCategory;
  amount: number;
};

const ComparisionDetailsMonetaryRow = ({
  label,
  left,
  right,
}: {
  label: string;
  left: ImpactDetail[];
  right: ImpactDetail[];
}) => {
  if (left.length === 0 && right.length === 0) return null;
  return (
    <ComparisonMonetaryRow
      label={label}
      labelBold
      projectValue={sumListWithKey(left, "amount")}
      scenarioValue={sumListWithKey(right, "amount")}
    />
  );
};

export default ComparisionDetailsMonetaryRow;
