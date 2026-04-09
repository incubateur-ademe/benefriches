import { useMemo } from "react";
import {
  convertSquareMetersToHectares,
  SoilsDistribution,
  SiteNature,
  FricheActivity,
  NaturalAreaType,
  UrbanZoneType,
  AgriculturalOperationActivity,
  getFricheActivityShortLabel,
  getShortLabelForAgriculturalOperationActivity,
  getLabelForNaturalAreaType,
  getLabelForUrbanZoneType,
} from "shared";

import { formatNumberFr, formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
  totalSurfaceArea: number;
  soilsDistribution: SoilsDistribution;
  wasSoilsDistributionAssignedByBenefriches: boolean;
  siteNature?: SiteNature;
  agriculturalOperationActivity?: AgriculturalOperationActivity;
  fricheActivity?: FricheActivity;
  naturalAreaType?: NaturalAreaType;
  urbanZoneType?: UrbanZoneType;
};

const SiteSoilsSummary = ({
  totalSurfaceArea,
  onNext,
  onBack,
  soilsDistribution,
  siteNature,
  agriculturalOperationActivity,
  fricheActivity,
  naturalAreaType,
  urbanZoneType,
  wasSoilsDistributionAssignedByBenefriches,
}: Props) => {
  const formattedTotalSurfaceAreaInHectare = formatNumberFr(
    convertSquareMetersToHectares(totalSurfaceArea),
  );

  const siteNatureAndActivityText = useMemo(() => {
    switch (siteNature) {
      case "FRICHE":
        return fricheActivity
          ? `friche (${getFricheActivityShortLabel(fricheActivity)})`
          : "friche";
      case "AGRICULTURAL_OPERATION":
        return agriculturalOperationActivity
          ? `exploitation agricole (${getShortLabelForAgriculturalOperationActivity(agriculturalOperationActivity)})`
          : "exploitation agricole";

      case "NATURAL_AREA":
        return naturalAreaType
          ? `espace naturel (${getLabelForNaturalAreaType(naturalAreaType).toLocaleLowerCase()})`
          : "espace naturel";

      case "URBAN_ZONE":
        return urbanZoneType
          ? `zone urbaine (${getLabelForUrbanZoneType(urbanZoneType).toLocaleLowerCase()})`
          : "zone urbaine";
    }
  }, [siteNature, agriculturalOperationActivity, fricheActivity, naturalAreaType, urbanZoneType]);

  return (
    <WizardFormLayout
      title="Récapitulatif de l'occupation des sols"
      instructions={
        wasSoilsDistributionAssignedByBenefriches ? (
          <FormInfo emoji="auto">
            <span className="title">D’où vient cette répartition&nbsp;?</span>

            <p>
              Les types de sols et leur répartition ont été affecté automatiquement par Bénéfriches
              en se basant sur les valeurs représentatives observées pour ce type de{" "}
              {siteNatureAndActivityText}.
            </p>
          </FormInfo>
        ) : null
      }
    >
      <p>
        Superficie totale du site :{" "}
        <strong>
          {formatSurfaceArea(totalSurfaceArea)}, soit {formattedTotalSurfaceAreaInHectare} ha
        </strong>
        .
      </p>
      <div className="mb-10">
        <SurfaceAreaPieChart
          soilsDistribution={soilsDistribution}
          exportConfig={{
            title: "Récapitulatif de l'occupation des sols",
            caption: `Surface totale : ${formatSurfaceArea(totalSurfaceArea)}`,
          }}
        />
      </div>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </WizardFormLayout>
  );
};

export default SiteSoilsSummary;
