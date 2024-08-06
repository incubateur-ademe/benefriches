import { useState } from "react";
import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import ImpactsChartsSection from "../../ImpactsChartsSection";
import SocioEconomicImpactsByActorChart from "./SocioEconomicImpactsByActorChart";
import SocioEconomicImpactsByCategoryChart from "./SocioEconomicImpactsByCategoryChart";

import { SocioEconomicImpactByActorAndCategory } from "@/features/projects/application/projectImpactsSocioEconomic.selectors";

type Props = {
  socioEconomicImpacts: SocioEconomicImpactByActorAndCategory;
  onClick: () => void;
};

type ChartViewMode = "by_actor" | "by_category";

type ChartViewModeControlProps = {
  setChartViewMode: (c: ChartViewMode) => void;
  currentChartViewMode: ChartViewMode;
};
const ChartViewModeControl = ({
  currentChartViewMode,
  setChartViewMode,
}: ChartViewModeControlProps) => {
  return (
    <SegmentedControl
      legend="Filtres"
      small
      hideLegend
      segments={[
        {
          label: "Par types d'impacts",
          nativeInputProps: {
            checked: currentChartViewMode === "by_category",
            onClick: () => {
              setChartViewMode("by_category");
            },
          },
        },
        {
          label: "Par bénéficiaires",
          nativeInputProps: {
            checked: currentChartViewMode === "by_actor",
            onClick: () => {
              setChartViewMode("by_actor");
            },
          },
        },
      ]}
    />
  );
};

function SocioEconomicImpactsCard({ socioEconomicImpacts, onClick }: Props) {
  const [currentChartViewMode, setChartViewMode] = useState<ChartViewMode>("by_category");

  return (
    <ImpactsChartsSection onClick={onClick} title="Impacts socio-économiques">
      {currentChartViewMode === "by_category" ? (
        <SocioEconomicImpactsByCategoryChart
          socioEconomicImpacts={socioEconomicImpacts.byCategory}
        />
      ) : (
        <SocioEconomicImpactsByActorChart socioEconomicImpacts={socioEconomicImpacts.byActor} />
      )}
      <div
        className="tw-flex tw-justify-center"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <ChartViewModeControl
          currentChartViewMode={currentChartViewMode}
          setChartViewMode={setChartViewMode}
        />
      </div>
    </ImpactsChartsSection>
  );
}

export default SocioEconomicImpactsCard;
