import { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import {
  typedObjectEntries,
  sumObjectValues,
  getFricheActivityLabel,
  getLabelForNaturalAreaType,
  getLabelForAgriculturalOperationActivity,
  getLabelForUrbanZoneType,
  getContaminatedPercentageFromFricheActivity,
  roundToInteger,
} from "shared";

import {
  formatNumberFr,
  formatPercentage,
  formatSurfaceArea,
} from "@/shared/core/format-number/formatNumber";
import classNames from "@/shared/views/clsx";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";
import SoilTypeLabelWithColorSquare from "@/shared/views/components/FeaturesList/FeaturesListSoilTypeLabel";

import { SiteFeatures } from "../../core/site.types";
import ExpressSiteDisclaimer from "./ExpressSiteDisclaimer";
import SiteFeaturesManagementSection from "./SiteFeaturesManagementSection";

// One id per `<Section>` rendered below (plus SiteFeaturesManagementSection's, which always
// renders exactly one). Read-only call sites (SitePage, the express-site result screen, the
// avoided-costs intro modal) never pass `sectionProps`, so they render byte-for-byte as before —
// only the create/update-site summaries pass it to get "Modifier" buttons + warnings.
export type SiteFeaturesSectionId =
  | "LOCATION"
  | "SOILS"
  | "URBAN_ZONE"
  | "CONTAMINATION"
  | "ACCIDENTS"
  | "MANAGEMENT"
  | "NAMING";

type Props = {
  siteFeatures: SiteFeatures;
  withExpressDisclaimer?: boolean;
  sectionProps?: Partial<
    Record<SiteFeaturesSectionId, { warning?: string; buttonProps?: ButtonProps }>
  >;
};

export default function SiteFeaturesList({
  withExpressDisclaimer = true,
  siteFeatures,
  sectionProps,
}: Props) {
  return (
    <>
      {withExpressDisclaimer && siteFeatures.isExpressSite && (
        <ExpressSiteDisclaimer siteNature={siteFeatures.nature} />
      )}
      <Section title="📍 Localisation" {...sectionProps?.LOCATION}>
        <DataLine label={<strong>Adresse du site</strong>} value={siteFeatures.address} />
      </Section>
      <Section
        title="🌾️ Sols"
        tooltip="L'occupation des sols conditionne la capacité d'infiltration des eaux, la capacité de stockage de carbone dans les sols, etc."
        {...sectionProps?.SOILS}
      >
        <DataLine
          noBorder
          label={<strong>Superficie totale du site</strong>}
          value={<strong>{formatSurfaceArea(roundToInteger(siteFeatures.surfaceArea))}</strong>}
        />

        <div className="grid grid-cols-12">
          <div
            className={classNames(
              "col-span-12",
              "md:col-span-3",
              "border-0",
              "border-solid",
              "border-l-black",
              "border-l",
            )}
          >
            <SurfaceAreaPieChart
              soilsDistribution={siteFeatures.soilsDistribution}
              mode="plain"
              customHeight="200px"
              exportConfig={{
                title: "Répartition de l'occupation des sols",
                subtitle: siteFeatures.name,
                caption: `Surface totale : ${formatSurfaceArea(roundToInteger(siteFeatures.surfaceArea))}`,
              }}
            />
          </div>

          <div
            className={classNames(
              "col-span-12",
              "md:col-span-9",
              "border-0",
              "border-solid",
              "border-l-black",
              "border-l",
              "md:border-0",
              "pl-2",
              "md:pl-0",
            )}
          >
            {typedObjectEntries(siteFeatures.soilsDistribution).map(([soilType, surfaceArea]) => {
              const valueTooltip = (() => {
                if (!siteFeatures.isExpressSite) {
                  return undefined;
                }
                switch (siteFeatures.nature) {
                  case "FRICHE":
                    return `Occupation des sols représentative des friches ${siteFeatures.fricheActivity ? `de type « ${getFricheActivityLabel(siteFeatures.fricheActivity)} »` : "de ce type"} dont l'ADEME a pu accompagner la reconversion.`;
                  case "AGRICULTURAL_OPERATION":
                    return `Occupation représentative des exploitations agricoles ${siteFeatures.agriculturalOperationActivity ? `de type « ${getLabelForAgriculturalOperationActivity(siteFeatures.agriculturalOperationActivity)} »` : "de ce type"}, d'après DRAAF Pays-de-la-Loire et web-agri.com.`;
                  case "NATURAL_AREA":
                    return `Occupation représentative des espaces naturels de type « ${getLabelForNaturalAreaType(siteFeatures.naturalAreaType ?? "MIXED_NATURAL_AREA")} ».`;
                }
              })();
              return (
                <DataLine
                  noBorder
                  label={<SoilTypeLabelWithColorSquare soilType={soilType} />}
                  value={formatSurfaceArea(roundToInteger(surfaceArea ?? 0))}
                  key={soilType}
                  className="md:grid-cols-[5fr_4fr]"
                  valueTooltip={valueTooltip}
                />
              );
            })}
          </div>
        </div>
      </Section>
      {siteFeatures.nature === "URBAN_ZONE" && (
        <Section title="🏙️ Zone urbaine" {...sectionProps?.URBAN_ZONE}>
          {siteFeatures.urbanZoneType && (
            <DataLine
              label={<strong>Type de zone urbaine</strong>}
              value={getLabelForUrbanZoneType(siteFeatures.urbanZoneType)}
            />
          )}
          {siteFeatures.managerName && (
            <DataLine label={<strong>Gestionnaire</strong>} value={siteFeatures.managerName} />
          )}
          {siteFeatures.vacantCommercialPremisesFootprint !== undefined && (
            <DataLine
              label={<strong>Emprise foncière des locaux commerciaux vacants ou en friche</strong>}
              value={formatSurfaceArea(
                roundToInteger(siteFeatures.vacantCommercialPremisesFootprint),
              )}
            />
          )}
          {siteFeatures.vacantCommercialPremisesFloorArea !== undefined && (
            <DataLine
              label={
                <strong>Surface de plancher des locaux commerciaux vacants ou en friche</strong>
              }
              value={formatSurfaceArea(
                roundToInteger(siteFeatures.vacantCommercialPremisesFloorArea),
              )}
            />
          )}
          {siteFeatures.fullTimeJobsEquivalent !== undefined && (
            <DataLine
              label={<strong>Emplois équivalents temps plein</strong>}
              value={formatNumberFr(siteFeatures.fullTimeJobsEquivalent)}
            />
          )}
        </Section>
      )}
      {siteFeatures.nature === "FRICHE" && (
        <>
          <Section title="☣️ Pollution" {...sectionProps?.CONTAMINATION}>
            <DataLine
              label={<strong>Superficie polluée</strong>}
              labelTooltip="Les activités antérieures exercées sur un site en friche, qu'elles soient industrielles, de service, ferroviaire, etc. peuvent être à l'origine de pollution des sols.
La pollution à l'amiante des bâtiments n'est pas considérée ici."
              valueTooltip={
                siteFeatures.isExpressSite && siteFeatures.fricheActivity
                  ? `On considère ici que ${formatPercentage(getContaminatedPercentageFromFricheActivity(siteFeatures.fricheActivity) * 100)} de la surface de la friche est polluée. Il s'agit d'une valeur couramment rencontrée sur les friches de type « ${getFricheActivityLabel(siteFeatures.fricheActivity)} ». Cela n'implique pas systématiquement que toute cette surface sera à dépolluer.`
                  : undefined
              }
              value={
                siteFeatures.contaminatedSurfaceArea
                  ? formatSurfaceArea(roundToInteger(siteFeatures.contaminatedSurfaceArea))
                  : "Pas de pollution déclarée"
              }
            />
          </Section>
          <Section title="💥 Accidents" {...sectionProps?.ACCIDENTS}>
            <>
              <DataLine
                label={<strong>Accidents survenus sur le site depuis 5 ans</strong>}
                labelTooltip="Les friches, en tant que lieux laissés à l'abandon, font fréquemment l'objet d'intrusion. La présence de zones dangereuses et l'état potentiellement délabrées (ex : toitures, passerelles) deviennent sources d'accident."
                value={<strong>{sumObjectValues(siteFeatures.accidents) || "Aucun"}</strong>}
                valueTooltip={
                  siteFeatures.isExpressSite
                    ? "En l'absence de moyennes chiffrées, on considère ici que la friche n'a pas été concernée par des accidents."
                    : undefined
                }
              />
              {sumObjectValues(siteFeatures.accidents) > 0 && (
                <div className="ml-4">
                  <DataLine
                    label="Blessés légers"
                    value={siteFeatures.accidents.minorInjuries ?? "Non renseigné"}
                  />
                  <DataLine
                    label="Blessés graves"
                    value={siteFeatures.accidents.severeInjuries ?? "Non renseigné"}
                  />
                  <DataLine
                    label="Tués"
                    value={siteFeatures.accidents.accidentsDeaths ?? "Non renseigné"}
                  />
                </div>
              )}
            </>
          </Section>
        </>
      )}
      <SiteFeaturesManagementSection {...siteFeatures} sectionProps={sectionProps?.MANAGEMENT} />
      <Section title="✍ Dénomination" {...sectionProps?.NAMING}>
        {(() => {
          switch (siteFeatures.nature) {
            case "FRICHE":
              return siteFeatures.fricheActivity ? (
                <DataLine
                  label={<strong>Type de friche</strong>}
                  value={getFricheActivityLabel(siteFeatures.fricheActivity)}
                />
              ) : null;
            case "AGRICULTURAL_OPERATION":
              return (
                <DataLine
                  label={<strong>Type d'exploitation</strong>}
                  value={getLabelForAgriculturalOperationActivity(
                    siteFeatures.agriculturalOperationActivity,
                  )}
                />
              );
            case "NATURAL_AREA":
              return (
                <DataLine
                  label={<strong>Nature du site</strong>}
                  value={getLabelForNaturalAreaType(siteFeatures.naturalAreaType)}
                />
              );
            default:
              return null;
          }
        })()}
        <DataLine label={<strong>Nom du site</strong>} value={siteFeatures.name} />
        {siteFeatures.description && (
          <DataLine label={<strong>Description</strong>} value={siteFeatures.description} />
        )}
      </Section>
    </>
  );
}
