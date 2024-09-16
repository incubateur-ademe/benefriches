import { useState } from "react";
import { FricheActivity } from "shared";
import ScenarioTile from "./ScenarioTile/ScenarioTile";

import { getFricheActivityLabel } from "@/features/create-site/domain/friche.types";

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
    ? getFricheActivityLabel(fricheActivity ?? "OTHER")
    : "Espace naturel ou agricole";
  const pictogramUrl = isFriche ? "/icons/friche.svg" : "/icons/agricole.svg";

  return (
    <ScenarioTile
      title={scenarioTitle}
      details="Pas de changement"
      onChangeCheckbox={onChangeCheckbox}
      pictogramUrl={pictogramUrl}
      isSelected={isSelected}
      shouldDisplayCheckbox={shouldDisplayCheckbox}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      isHovered={isHovered}
      tooltipText={`Les impacts du scénario "Pas de changement" seront accessibles dans une version ultérieure de l'outil.`}
    />
  );
}

export default StatuQuoScenarioTile;
