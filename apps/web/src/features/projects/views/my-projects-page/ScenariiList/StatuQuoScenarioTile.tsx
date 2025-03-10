import { useState } from "react";
import { FricheActivity, getFricheActivityLabel, SiteNature } from "shared";

import ScenarioTile from "./ScenarioTile/ScenarioTile";

type Props = {
  siteId: string;
  selectedIds?: string[];
  selectableIds?: string[];
  onChangeSelectedSite?: (value?: string) => void;
  siteNature: SiteNature;
  fricheActivity?: FricheActivity;
};

function getScenarioTitle(siteNature: SiteNature, fricheActivity?: FricheActivity): string {
  switch (siteNature) {
    case "FRICHE":
      return getFricheActivityLabel(fricheActivity ?? "OTHER");
    case "AGRICULTURAL_OPERATION":
      return "Exploitation agricole";
    case "NATURAL_AREA":
      return "Espace naturel";
  }
}

function getPictogramUrlForScenario(siteNature: SiteNature): string {
  switch (siteNature) {
    case "FRICHE":
      return "/img/pictograms/site-nature/friche.svg";
    case "AGRICULTURAL_OPERATION":
      return "/img/pictograms/site-nature/agricultural-operation.svg";
    case "NATURAL_AREA":
      return "/img/pictograms/site-nature/natural-area.svg";
  }
}

function StatuQuoScenarioTile({
  siteId,
  onChangeSelectedSite = () => {},
  selectedIds = [],
  selectableIds = [],
  siteNature,
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

  const scenarioTitle = getScenarioTitle(siteNature, fricheActivity);
  const pictogramUrl = getPictogramUrlForScenario(siteNature);

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
