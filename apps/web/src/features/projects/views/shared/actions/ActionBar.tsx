import { SegmentedControl, SegmentedControlProps } from "@codegouvfr/react-dsfr/SegmentedControl";

import { ViewMode } from "@/features/projects/application/project-impacts/projectImpacts.reducer";
import classNames, { ClassValue } from "@/shared/views/clsx";
import { useIsSmallScreen } from "@/shared/views/hooks/useIsSmallScreen";

import ImpactEvaluationPeriodSelect from "./ImpactEvaluationPeriodSelect";

export type ActionBarProps = {
  selectedViewMode: ViewMode;
  evaluationPeriod: number | undefined;
  onViewModeClick: (viewMode: ViewMode) => void;
  onEvaluationPeriodChange: (n: number) => void;
  small?: boolean;
  segments?: [ViewMode, ViewMode, ViewMode?, ViewMode?, ViewMode?];
  className?: ClassValue;
  ref?: React.Ref<HTMLElement>;
};

function ImpactsActionBar({
  onViewModeClick,
  selectedViewMode,
  evaluationPeriod,
  onEvaluationPeriodChange,
  segments = ["summary", "list", "charts"],
  className,
  ref,
}: ActionBarProps) {
  const isSmScreen = useIsSmallScreen();

  return (
    <section ref={ref} className={classNames("flex", "flex-wrap", "gap-4", className)}>
      {evaluationPeriod !== undefined && (
        <ImpactEvaluationPeriodSelect
          onChange={onEvaluationPeriodChange}
          value={evaluationPeriod}
        />
      )}
      <SegmentedControl
        small={isSmScreen}
        legend="Filtres"
        hideLegend
        segments={
          segments.map((viewMode) => {
            switch (viewMode) {
              case "charts":
                return {
                  label: "Graphique",
                  iconId: "fr-icon-line-chart-fill",

                  nativeInputProps: {
                    checked: selectedViewMode === "charts",
                    onChange: () => {
                      onViewModeClick("charts");
                    },
                  },
                };
              case "list":
                return {
                  label: "Liste",
                  iconId: "fr-icon-list-unordered",

                  nativeInputProps: {
                    checked: selectedViewMode === "list",
                    onChange: () => {
                      onViewModeClick("list");
                    },
                  },
                };
              case "summary":
                return {
                  label: "Synthèse",
                  iconId: "fr-icon-lightbulb-line",

                  nativeInputProps: {
                    checked: selectedViewMode === "summary",
                    onChange: () => {
                      onViewModeClick("summary");
                    },
                  },
                };
            }
          }) as SegmentedControlProps["segments"]
        }
      />
    </section>
  );
}

export default ImpactsActionBar;
