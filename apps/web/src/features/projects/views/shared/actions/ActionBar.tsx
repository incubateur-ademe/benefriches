import { forwardRef } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import Select from "@codegouvfr/react-dsfr/SelectNext";
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
        <div className="tw-flex tw-gap-4">
          <ImpactEvaluationPeriodSelect
            onChange={onEvaluationPeriodChange}
            value={evaluationPeriod}
          />
          <Select
            label=""
            className="!tw-mb-0"
            nativeSelectProps={{
              value: selectedFilter,
              onChange: (e) => {
                onFilterClick(e.currentTarget.value as ImpactCategoryFilter);
              },
            }}
            options={[
              {
                label: "Tous les indicateurs",
                value: "all",
              },
              {
                label: "Économiques",
                value: "economic",
              },
              {
                label: "Sociaux",
                value: "social",
              },
              {
                label: "Environnementaux",
                value: "environment",
              },
            ]}
          />
        </div>
        <div className={classNames(fr.cx("fr-grid-row"), "tw-items-center")}>
          <SegmentedControl
            legend="Filtres"
            className="fr-mr-3w"
            hideLegend
            segments={[
              {
                label: "Graphique",
                nativeInputProps: getViewSegmentInputProps("charts"),
                iconId: "fr-icon-line-chart-fill",
              },
              {
                label: "Liste",
                nativeInputProps: getViewSegmentInputProps("list"),
                iconId: "fr-icon-list-unordered",
              },
            ]}
          />
        </div>
      </section>
    );
  },
);

ImpactsActionBar.displayName = "ImpactsActionBar";

export default ImpactsActionBar;
