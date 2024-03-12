import { useState } from "react";
import ScenarioTile from "./ScenarioTile";

import { routes } from "@/app/views/router";

type Props = {
  id: string;
  name: string;
  selectedIds: string[];
  selectableIds: string[];
  yearlyProfit: number;
  type: string;
  onChangeSelectedProject: (id: string, checked: boolean) => void;
};

const getProjectPictoUrl = (type: string) => {
  if (type === "PHOTOVOLTAIC_POWER_PLANT") {
    return "icons/photovoltaique.svg";
  }
  return undefined;
};

function ProjectScenarioTile({
  id,
  name,
  type,
  onChangeSelectedProject,
  selectedIds,
  yearlyProfit,
  selectableIds,
}: Props) {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const onChangeCheckbox = (checked: boolean) => {
    onChangeSelectedProject(id, checked);
  };

  const projectImpactsLinkProps = routes.projectImpacts({
    projectId: id,
  }).link;

  const onMouseEnter = () => {
    setIsHovered(true);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
  };

  const isSelected = selectedIds.includes(id);
  const isSelectable = selectableIds.includes(id);
  const hasSelectedValues = selectedIds.length > 0;

  const shouldDisplayCheckbox = isSelected || ((hasSelectedValues || isHovered) && isSelectable);

  return (
    <ScenarioTile
      projectName={name}
      impactLinkProps={projectImpactsLinkProps}
      onChangeCheckbox={onChangeCheckbox}
      yearlyProfit={yearlyProfit}
      pictogramUrl={getProjectPictoUrl(type)}
      isSelected={isSelected}
      shouldDisplayCheckbox={shouldDisplayCheckbox}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}

export default ProjectScenarioTile;
