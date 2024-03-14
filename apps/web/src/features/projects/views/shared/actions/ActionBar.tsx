import { fr } from "@codegouvfr/react-dsfr";
import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import { ImpactCategoryFilter, ViewMode } from "../../project-impacts-page/ProjectImpactsPage";
import ImpactEvaluationPeriodSelect from "./ImpactEvaluationPeriodSelect";

type Props = {
  selectedFilter: ImpactCategoryFilter;
  selectedViewMode: ViewMode;
  evaluationPeriod: number;
  onFilterClick: (filterValue: ImpactCategoryFilter) => void;
  onViewModeClick: (viewMode: ViewMode) => void;
  onEvaluationPeriodChange: (n: number) => void;
};

function ImpactsActionBar({
  onFilterClick,
  onViewModeClick,
  selectedFilter,
  selectedViewMode,
  evaluationPeriod,
  onEvaluationPeriodChange,
}: Props) {
  const getFilterSegmentInputProps = (value: ImpactCategoryFilter) => {
    return {
      checked: selectedFilter === value,
      onClick: () => {
        onFilterClick(value);
      },
    };
  };

  const getViewSegmentInputProps = (value: ViewMode) => {
    return {
      checked: selectedViewMode === value,
      onClick: () => {
        onViewModeClick(value);
      },
    };
  };

  return (
    <section
      className={fr.cx("fr-grid-row", "fr-py-2w", "fr-mb-1w")}
      style={{ justifyContent: "space-between", alignItems: "center" }}
    >
      <div className={fr.cx("fr-grid-row")} style={{ alignItems: "center" }}>
        <SegmentedControl
          legend="Filtres"
          hideLegend
          segments={[
            {
              label: "Tous",
              nativeInputProps: getFilterSegmentInputProps("all"),
            },
            {
              label: "Économiques",
              nativeInputProps: getFilterSegmentInputProps("economic"),
            },
            {
              label: "Sociaux",
              nativeInputProps: getFilterSegmentInputProps("social"),
            },
            {
              label: "Environnementaux",
              nativeInputProps: getFilterSegmentInputProps("environment"),
            },
          ]}
        />
      </div>
      <div className={fr.cx("fr-grid-row", "fr-btns-group--between")}>
        <SegmentedControl
          legend="Filtres"
          className="fr-mr-3w"
          hideLegend
          segments={[
            {
              label: "Vue graphiques",
              nativeInputProps: getViewSegmentInputProps("charts"),
              iconId: "fr-icon-line-chart-fill",
            },
            {
              label: "Vue liste",
              nativeInputProps: getViewSegmentInputProps("list"),
              iconId: "fr-icon-list-unordered",
            },
          ]}
        />
        <ImpactEvaluationPeriodSelect
          onChange={onEvaluationPeriodChange}
          value={evaluationPeriod}
        />
      </div>
    </section>
  );
}

export default ImpactsActionBar;
