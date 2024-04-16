import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import { DevelopmentPlanCategory } from "../../domain/project.types";
import {
  getDescriptionForDevelopmentPlanCategory,
  getLabelForDevelopmentPlanCategory,
  getPictogramForDevelopmentPlanCategory,
} from "../projectTypeLabelMapping";

import classNames from "@/shared/views/clsx";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";

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
            <Badge
              small
              as="span"
              className={classNames(fr.cx("fr-mt-1w"), "tw-normal-case", "tw-font-normal")}
            >
              Bientôt disponible
            </Badge>
          </div>
        ) : (
          description
        )
      }
      imgSrc={imgSrc}
      disabled={disabled}
      isSelected={isSelected}
      onSelect={onSelect}
      checkType="radio"
    />
  );
}
