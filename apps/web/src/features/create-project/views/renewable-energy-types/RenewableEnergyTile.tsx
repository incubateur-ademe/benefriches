import {
  getDescriptionForRenewableEnergyType,
  getLabelForRenewableEnergyProductionType,
  getPictogramForRenewableEnergy,
} from "../projectTypeLabelMapping";

import { RenewableEnergyDevelopmentPlanType } from "@/shared/domain/reconversionProject";
import Badge from "@/shared/views/components/Badge/Badge";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";

type Props = {
  renewableEnergy: RenewableEnergyDevelopmentPlanType;
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
};

export default function RenewableEnergyTile({
  renewableEnergy,
  isSelected,
  disabled,
  onSelect,
}: Props) {
  const title = getLabelForRenewableEnergyProductionType(renewableEnergy);
  const description = getDescriptionForRenewableEnergyType(renewableEnergy);
  const imgSrc = `/img/pictograms/renewable-energy/${getPictogramForRenewableEnergy(renewableEnergy)}`;
  return (
    <CheckableTile
      title={title}
      description={
        disabled ? (
          <div>
            <div>{description}</div>
            <Badge small className="tw-mt-2">
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
