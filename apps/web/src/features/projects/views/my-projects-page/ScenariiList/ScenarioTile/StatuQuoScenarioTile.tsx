import { useState } from "react";
import ScenarioTile from "./ScenarioTile";

type Props = {
  siteId: string;
  siteName: string;
  selectedIds: string[];
  selectableIds: string[];
  isFriche: boolean;
  yearlyProfit: number;
  onChangeSelectedSite: (value?: string) => void;
};

function StatuQuoScenarioTile({
  siteId,
  siteName,
  onChangeSelectedSite,
  selectedIds,
  selectableIds,
  isFriche,
  yearlyProfit,
}: Props) {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const onChangeCheckbox = (checked: boolean) => {
    onChangeSelectedSite(checked ? siteId : undefined);
  };

  const onMouseEnter = () => {
    setIsHovered(true);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
  };

  const isSelected = selectedIds.includes(siteId);
  const isSelectable = selectableIds.includes(siteId);
  const hasSelectedValues = selectedIds.length > 0;

  const shouldDisplayCheckbox = isSelected || ((hasSelectedValues || isHovered) && isSelectable);

  const projectIcon = isFriche ? "icons/friche.svg" : "icons/agricole.svg";

  return (
    <ScenarioTile
      projectName={siteName}
      details="Pas de changement"
      onChangeCheckbox={onChangeCheckbox}
      yearlyProfit={yearlyProfit}
      pictogramUrl={projectIcon}
      isSelected={isSelected}
      shouldDisplayCheckbox={shouldDisplayCheckbox}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}

export default StatuQuoScenarioTile;
