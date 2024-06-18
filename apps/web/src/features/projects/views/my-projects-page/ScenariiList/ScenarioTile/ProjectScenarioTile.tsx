import { useState } from "react";
import { getScenarioPictoUrl } from "../../../shared/scenarioType";
import ScenarioTile from "./ScenarioTile";

import { routes } from "@/app/views/router";

type Props = {
  id: string;
  name: string;
  selectedIds: string[];
  selectableIds: string[];
  type: string;
  onChangeSelectedProject: (id: string, checked: boolean) => void;
};

function ProjectScenarioTile({
  id,
  name,
  type,
  onChangeSelectedProject,
  selectedIds,
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
      title={name}
      linkProps={projectImpactsLinkProps}
      onChangeCheckbox={onChangeCheckbox}
      pictogramUrl={getScenarioPictoUrl(type)}
      isSelected={isSelected}
      shouldDisplayCheckbox={shouldDisplayCheckbox}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      isHovered={isHovered}
    />
  );
}

export default ProjectScenarioTile;
