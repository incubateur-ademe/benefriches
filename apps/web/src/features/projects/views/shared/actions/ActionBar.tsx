import { forwardRef } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import ImpactEvaluationPeriodSelect from "./ImpactEvaluationPeriodSelect";

import {
  ImpactCategoryFilter,
  ViewMode,
} from "@/features/projects/application/projectImpacts.reducer";
import classNames from "@/shared/views/clsx";

type Props = {
  selectedFilter: ImpactCategoryFilter;
  selectedViewMode: ViewMode;
  evaluationPeriod: number;
  onFilterClick: (filterValue: ImpactCategoryFilter) => void;
  onViewModeClick: (viewMode: ViewMode) => void;
  onEvaluationPeriodChange: (n: number) => void;
};

type Ref = HTMLDivElement;

const ImpactsActionBar = forwardRef<Ref, Props>(
  (
    {
      onFilterClick,
      onViewModeClick,
      selectedFilter,
      selectedViewMode,
      evaluationPeriod,
      onEvaluationPeriodChange,
    },
    ref,
  ) => {
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
        ref={ref}
        className={classNames(
          fr.cx("fr-grid-row", "fr-py-2w", "fr-mb-1w"),
          "tw-justify-between",
          "tw-items-center",
        )}
      >
        <div className={classNames(fr.cx("fr-grid-row"), "tw-items-center")}>
          <SegmentedControl
            legend="Filtres"
            hideLegend
            segments={[
              {
                label: "Tous",
                nativeInputProps: getFilterSegmentInputProps("all"),
              },
              {
                label: "Économie",
                nativeInputProps: getFilterSegmentInputProps("economic"),
              },
              {
                label: "Social",
                nativeInputProps: getFilterSegmentInputProps("social"),
              },
              {
                label: "Environnement",
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
                label: "Vue graphique",
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
  },
);

ImpactsActionBar.displayName = "ImpactsActionBar";

export default ImpactsActionBar;
