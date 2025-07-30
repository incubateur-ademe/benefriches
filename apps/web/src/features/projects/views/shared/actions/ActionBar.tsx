import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";

import { ViewMode } from "@/features/projects/application/project-impacts/projectImpacts.reducer";
import { useIsSmallScreen } from "@/shared/views/hooks/useIsSmallScreen";

import ImpactEvaluationPeriodSelect from "./ImpactEvaluationPeriodSelect";

type Props = {
  selectedViewMode: ViewMode;
  evaluationPeriod: number | undefined;
  onViewModeClick: (viewMode: ViewMode) => void;
  onEvaluationPeriodChange: (n: number) => void;
  small?: boolean;
  ref?: React.Ref<HTMLElement>;
  disabledSegments?: ViewMode[];
};

function ImpactsActionBar({
  onViewModeClick,
  selectedViewMode,
  evaluationPeriod,
  onEvaluationPeriodChange,
  ref,
  disabledSegments,
}: Props) {
  const isSmScreen = useIsSmallScreen();
  const getViewSegmentInputProps = (value: ViewMode) => {
    return {
      disabled: disabledSegments?.includes(value),
      checked: selectedViewMode === value,
      onChange: () => {
        onViewModeClick(value);
      },
    };
  };

  return (
    <section ref={ref} className="md:tw-flex tw-mt-4 tw-justify-between">
      <SegmentedControl
        small={isSmScreen}
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
        {evaluationPeriod !== undefined && (
          <ImpactEvaluationPeriodSelect
            onChange={onEvaluationPeriodChange}
            value={evaluationPeriod}
          />
        )}
      </div>
    </section>
  );
}

export default ImpactsActionBar;
