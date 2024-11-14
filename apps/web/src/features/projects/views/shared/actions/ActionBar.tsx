import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import Select from "@codegouvfr/react-dsfr/SelectNext";
import { forwardRef } from "react";

import {
  ImpactCategoryFilter,
  ViewMode,
} from "@/features/projects/application/projectImpacts.reducer";

import ImpactEvaluationPeriodSelect from "./ImpactEvaluationPeriodSelect";

type Props = {
  selectedFilter: ImpactCategoryFilter;
  selectedViewMode: ViewMode;
  evaluationPeriod: number;
  onFilterClick: (filterValue: ImpactCategoryFilter) => void;
  onViewModeClick: (viewMode: ViewMode) => void;
  onEvaluationPeriodChange: (n: number) => void;
  small?: boolean;
};

type Ref = HTMLDivElement;

const ImpactsActionBar = forwardRef<Ref, Props>(function BaseImpactsActionBar(baseProps, ref) {
  // props are not destructured nor named 'props' here because of an issue with eslint-plugin-react when using forwardRef
  // see https://github.com/jsx-eslint/eslint-plugin-react/issues/3796
  const {
    onFilterClick,
    onViewModeClick,
    selectedFilter,
    selectedViewMode,
    evaluationPeriod,
    onEvaluationPeriodChange,
    small,
  } = baseProps;

  const getViewSegmentInputProps = (value: ViewMode) => {
    return {
      checked: selectedViewMode === value,
      onClick: () => {
        onViewModeClick(value);
      },
    };
  };

  return (
    <section ref={ref} className="md:tw-flex tw-py-4 tw-mb-2 tw-justify-between">
      <SegmentedControl
        small={small}
        legend="Filtres"
        hideLegend
        segments={[
          {
            label: "Synthèse",
            nativeInputProps: getViewSegmentInputProps("summary"),
            iconId: "fr-icon-lightbulb-line",
          },
          {
            label: "Liste",
            nativeInputProps: getViewSegmentInputProps("list"),
            iconId: "fr-icon-list-unordered",
          },
          {
            label: "Graphique",
            nativeInputProps: getViewSegmentInputProps("charts"),
            iconId: "fr-icon-line-chart-fill",
          },
        ]}
      />
      <div className="tw-flex tw-flex-col tw-mt-4 tw-w-full md:tw-mt-0 md:tw-w-auto md:tw-flex-row tw-gap-4">
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
    </section>
  );
});

export default ImpactsActionBar;
