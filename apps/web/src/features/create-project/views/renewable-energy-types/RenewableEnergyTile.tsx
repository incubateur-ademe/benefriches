import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import { RenewableEnergyDevelopmentPlanType } from "../../domain/project.types";
import {
  getDescriptionForRenewableEnergyType,
  getLabelForRenewableEnergyProductionType,
  getPictogramForRenewableEnergy,
} from "../projectTypeLabelMapping";

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
      checkType="radio"
    />
  );
}
