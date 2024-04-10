import { useState } from "react";
import ScenarioTile from "./ScenarioTile";

import { FricheActivity, getFricheActivityLabel } from "@/features/create-site/domain/friche.types";

type Props = {
  siteId: string;
  selectedIds: string[];
  selectableIds: string[];
  onChangeSelectedSite: (value?: string) => void;
  isFriche: boolean;
  fricheActivity?: FricheActivity;
};

function StatuQuoScenarioTile({
  siteId,
  onChangeSelectedSite,
  selectedIds,
  selectableIds,
  isFriche,
  fricheActivity,
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

  const scenarioTitle = isFriche
    ? getFricheActivityLabel(fricheActivity ?? FricheActivity.OTHER)
    : "Espace naturel ou agricole";
  const projectIcon = isFriche ? "/icons/friche.svg" : "/icons/agricole.svg";

  return (
    <ScenarioTile
      projectName={scenarioTitle}
      details="Pas de changement"
      onChangeCheckbox={onChangeCheckbox}
      pictogramUrl={projectIcon}
      isSelected={isSelected}
      shouldDisplayCheckbox={shouldDisplayCheckbox}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}

export default StatuQuoScenarioTile;
