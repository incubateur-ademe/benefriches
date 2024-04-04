import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import { DevelopmentPlanCategory } from "../../domain/project.types";
import {
  getDescriptionForDevelopmentPlanCategory,
  getLabelForDevelopmentPlanCategory,
  getPictogramForDevelopmentPlanCategory,
} from "../projectTypeLabelMapping";

import SelectableTile from "@/shared/views/components/SelectableTile/SelectableTile";

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
    <SelectableTile
      title={title}
      description={
        disabled ? (
          <div>
            <div>{description}</div>
            <Badge
              small
              as="span"
              className={fr.cx("fr-mt-1w")}
              style={{ fontWeight: "normal", textTransform: "none" }}
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
      style={{ minHeight: "270px" }}
    />
  );
}
