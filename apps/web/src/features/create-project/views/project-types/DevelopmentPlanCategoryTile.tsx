import { DevelopmentPlanCategory } from "shared";

import Badge from "@/shared/views/components/Badge/Badge";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";

import {
  getDescriptionForDevelopmentPlanCategory,
  getLabelForDevelopmentPlanCategory,
  getPictogramForDevelopmentPlanCategory,
} from "../projectTypeLabelMapping";

type Props = {
  developmentPlanCategory: DevelopmentPlanCategory;
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
};

export default function DevelopmentPlanCategoryTile({
  developmentPlanCategory,
  isSelected,
  disabled,
  onSelect,
}: Props) {
  const title = getLabelForDevelopmentPlanCategory(developmentPlanCategory);
  const description = getDescriptionForDevelopmentPlanCategory(developmentPlanCategory);
  const imgSrc = `/img/pictograms/development-plans/${getPictogramForDevelopmentPlanCategory(developmentPlanCategory)}`;
  return (
    <CheckableTile
      title={title}
      description={
        disabled ? (
          <div>
            <div>{description}</div>
            <Badge small style="disabled" className="tw-mt-2">
              Bientôt disponible
            </Badge>
          </div>
        ) : (
          description
        )
      }
      disabled={disabled}
      onChange={onSelect}
      checked={isSelected}
      imgSrc={imgSrc}
    />
  );
}
