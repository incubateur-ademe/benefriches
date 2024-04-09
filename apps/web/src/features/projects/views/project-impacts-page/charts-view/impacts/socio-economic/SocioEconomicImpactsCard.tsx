import { useState } from "react";
import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import ImpactCard from "../../ImpactChartCard/ImpactChartCard";
import SocioEconomicImpactsByActorChart from "./SocioEconomicImpactsByActorChart";
import SocioEconomicImpactsByCategoryChart from "./SocioEconomicImpactsByCategoryChart";

import { ReconversionProjectImpacts } from "@/features/projects/domain/impacts.types";

type Props = {
  socioEconomicImpacts: ReconversionProjectImpacts["socioeconomic"]["impacts"];
  onTitleClick: () => void;
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

function SocioEconomicImpactsCard({ socioEconomicImpacts, onTitleClick }: Props) {
  const [currentChartViewMode, setChartViewMode] = useState<ChartViewMode>("by_category");

  return (
    <ImpactCard
      title={
        <div
          className="fr-mb-2w"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <strong className="tw-cursor-pointer hover:tw-underline" onClick={onTitleClick}>
            Impacts socio-économiques
          </strong>
          <ChartViewModeControl
            currentChartViewMode={currentChartViewMode}
            setChartViewMode={setChartViewMode}
          />
        </div>
      }
    >
      {currentChartViewMode === "by_category" ? (
        <SocioEconomicImpactsByCategoryChart socioEconomicImpacts={socioEconomicImpacts} />
      ) : (
        <SocioEconomicImpactsByActorChart socioEconomicImpacts={socioEconomicImpacts} />
      )}
    </ImpactCard>
  );
}

export default SocioEconomicImpactsCard;
