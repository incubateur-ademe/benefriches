import Alert from "@codegouvfr/react-dsfr/Alert";
import { getLabelForUrbanZoneType } from "shared";
import type { SoilType, UrbanZoneLandParcelType } from "shared";

import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";
import SoilTypeLabelWithColorSquare from "@/shared/views/components/FeaturesList/FeaturesListSoilTypeLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import type { UrbanZoneFinalSummaryViewData } from "../../../core/urban-zone/steps/final-summary/finalSummary.selectors";
import { PARCEL_TYPE_LABELS } from "../landParcelTypeMetadata";

const MANAGER_LABELS: Record<string, string> = {
  activity_park_manager: "Gestionnaire de parc d'activité",
  local_authority: "Collectivité",
};

type SaveState = "idle" | "dirty" | "loading" | "success" | "error";

// Update-mode save-state labels (ticket 11), mirroring common-views/summary/SiteDataSummary.tsx
// — creation's own save flow routes away to URBAN_ZONE_CREATION_RESULT instead of ever reaching
// this label, so `saveState` is optional and unused there.
const NEXT_LABEL_BY_SAVE_STATE: Partial<Record<SaveState, string>> = {
  loading: "Sauvegarde en cours…",
  success: "Modifications sauvegardées",
};

type Props = UrbanZoneFinalSummaryViewData & {
  onNext: () => void;
  onBack: () => void;
  saveState?: SaveState;
};

function UrbanZoneFinalSummary({
  address,
  urbanZoneType,
  totalSurfaceArea,
  parcelSurfaceAreas,
  soilsDistribution,
  hasContaminatedSoils,
  contaminatedSoilSurface,
  managerStructureType,
  managerName,
  vacantPremisesFootprint,
  vacantPremisesFloorArea,
  fullTimeJobs,
  siteName,
  siteDescription,
  onNext,
  onBack,
  saveState,
}: Props) {
  return (
    <WizardFormLayout title="Récapitulatif du site">
      {saveState === "error" && (
        <Alert
          className="mb-4"
          severity="error"
          title="La sauvegarde a échoué"
          description="Une erreur s'est produite lors de l'enregistrement des modifications. Veuillez réessayer."
        />
      )}
      <Section title="📍 Localisation">
        <DataLine label={<strong>Adresse du site</strong>} value={address} />
        {urbanZoneType && (
          <DataLine
            label={<strong>Type de zone urbaine</strong>}
            value={getLabelForUrbanZoneType(urbanZoneType)}
          />
        )}
      </Section>

      <Section title="🗺️ Surfaces foncières">
        <DataLine
          noBorder
          label={<strong>Superficie totale</strong>}
          value={<strong>{formatSurfaceArea(totalSurfaceArea)}</strong>}
        />
        {(Object.entries(parcelSurfaceAreas) as [UrbanZoneLandParcelType, number][]).map(
          ([parcelType, area]) => (
            <DataLine
              key={parcelType}
              label={PARCEL_TYPE_LABELS[parcelType]}
              value={formatSurfaceArea(area)}
            />
          ),
        )}
      </Section>

      <Section title="🌾️ Sols">
        {(Object.entries(soilsDistribution) as [SoilType, number | undefined][]).map(
          ([soilType, area]) => (
            <DataLine
              key={soilType}
              label={<SoilTypeLabelWithColorSquare soilType={soilType} />}
              value={formatSurfaceArea(area ?? 0)}
            />
          ),
        )}
      </Section>

      <Section title="☣️ Pollution">
        <DataLine
          label={<strong>Sols pollués</strong>}
          value={
            hasContaminatedSoils
              ? contaminatedSoilSurface !== undefined
                ? formatSurfaceArea(contaminatedSoilSurface)
                : "Oui"
              : "Non"
          }
        />
      </Section>

      <Section title="💼 Gestion et activité">
        {managerStructureType && (
          <DataLine
            label={<strong>Gestionnaire</strong>}
            value={managerName ?? MANAGER_LABELS[managerStructureType] ?? "Non renseigné"}
          />
        )}
        {vacantPremisesFootprint !== undefined && (
          <DataLine
            label={<strong>Emprise des locaux vacants</strong>}
            value={formatSurfaceArea(vacantPremisesFootprint)}
          />
        )}
        {vacantPremisesFloorArea !== undefined && (
          <DataLine
            label={<strong>Surface de plancher des locaux vacants</strong>}
            value={formatSurfaceArea(vacantPremisesFloorArea)}
          />
        )}
        {fullTimeJobs !== undefined && (
          <DataLine
            label={<strong>Emplois en équivalent temps plein</strong>}
            value={String(fullTimeJobs)}
          />
        )}
      </Section>

      <Section title="✍ Dénomination">
        <DataLine label={<strong>Nom du site</strong>} value={siteName} />
        {siteDescription && (
          <DataLine label={<strong>Description</strong>} value={siteDescription} />
        )}
      </Section>

      <div className="mt-8">
        <BackNextButtonsGroup
          onBack={onBack}
          onNext={onNext}
          disabled={saveState === "loading"}
          nextLabel={saveState ? NEXT_LABEL_BY_SAVE_STATE[saveState] : undefined}
        />
      </div>
    </WizardFormLayout>
  );
}

export default UrbanZoneFinalSummary;
