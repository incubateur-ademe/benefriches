import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";

import { ViewMode } from "@/features/projects/application/projectImpacts.reducer";

import ImpactEvaluationPeriodSelect from "./ImpactEvaluationPeriodSelect";

type Props = {
  selectedViewMode: ViewMode;
  evaluationPeriod: number;
  onViewModeClick: (viewMode: ViewMode) => void;
  onEvaluationPeriodChange: (n: number) => void;
  small?: boolean;
  ref: React.Ref<HTMLElement>;
};

function ImpactsActionBar({
  onViewModeClick,
  selectedViewMode,
  evaluationPeriod,
  onEvaluationPeriodChange,
  small,
  ref,
}: Props) {
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
      <div className="tw-mt-4 tw-w-full md:tw-mt-0 md:tw-w-auto">
        <ImpactEvaluationPeriodSelect
          onChange={onEvaluationPeriodChange}
          value={evaluationPeriod}
        />
      </div>
    </section>
  );
}

export default ImpactsActionBar;
