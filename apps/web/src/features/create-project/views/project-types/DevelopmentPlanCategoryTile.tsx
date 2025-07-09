import Tooltip from "@codegouvfr/react-dsfr/Tooltip";
import { useId } from "react";
import { DevelopmentPlanCategory } from "shared";

import Badge from "@/shared/views/components/Badge/Badge";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";

import {
  getDescriptionForDevelopmentPlanCategory,
  getPictogramForDevelopmentPlanCategory,
} from "../projectTypeLabelMapping";

type Props = {
  developmentPlanCategory: DevelopmentPlanCategory;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  title: string;
};

export default function DevelopmentPlanCategoryTile({
  developmentPlanCategory,
  isSelected,
  disabled,
  title,
  onSelect,
}: Props) {
  const description = getDescriptionForDevelopmentPlanCategory(developmentPlanCategory);
  const imgSrc = `/img/pictograms/development-plans/${getPictogramForDevelopmentPlanCategory(developmentPlanCategory)}`;
  const tooltipId = useId();

  const tile = (
    <CheckableTile
      title={title}
      description={
        disabled ? (
          <div>
            <div>{description}</div>
            <Badge small style="green-tilleul" className="tw-mt-2">
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

  return disabled ? (
    <Tooltip
      kind="hover"
      title="Fonctionnalité en cours de développement, sera disponible courant 2025."
      id={tooltipId}
    >
      {tile}
    </Tooltip>
  ) : (
    tile
  );
}
