import { lazy, Suspense, useContext, useMemo } from "react";
import { AggregatedReconversionProjectOnSiteImpactItemView } from "shared";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import { groupIndirectEconomicImpactsByBearerAndCategory } from "@/features/projects/core/groupIndirectImpactsByBearer";
import {
  getSocioEconomicProjectImpactsGroupedByCategory,
  SocioEconomicDetailsName,
  SocioEconomicImpactImpactKeyName,
  SocioEconomicImpactsByBearerListView,
  SocioEconomicMainImpactName,
} from "@/features/projects/core/projectImpactsSocioEconomic";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ImpactInProgressDescriptionModal from "@/features/projects/views/shared/impacts/modals/ImpactInProgressDescriptionModal";
import {
  ImpactModalDescriptionContext,
  SocioEconomicSubSectionName,
} from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { getSocioEconomicImpactLabel } from "../../getImpactLabel";
import ModalTable from "../shared/ModalTable";
import { LazyContent, LazyContentComponent } from "../shared/lazy-content/LazyContent";
import ModalColumnPointChart from "../shared/modal-charts/ModalColumnPointChart";
import { getSubSectionBreadcrumb } from "./breadcrumbSections";
import { getSocioEconomicImpactColor } from "./getSocioEconomicImpactColor";

const SocioEconomicDescription = lazy(() => import("./SocioEconomicDescription"));
const LocalPeopleOrCompanyDescription = lazy(() => import("./LocalPeopleOrCompanyDescription"));
const HumanityDescription = lazy(() => import("./HumanityDescription"));
const LocalAuthorityDescription = lazy(() => import("./LocalAuthorityDescription"));

type Props = {
  impactName?: SocioEconomicMainImpactName;
  impactDetailsName?: SocioEconomicDetailsName;
  impactSubSectionName?: SocioEconomicSubSectionName;
  impactsData: ModalDataProps["impactsData"];
  contextData: ModalDataProps["contextData"];
};

type SplitSocioKey<K extends SocioEconomicImpactImpactKeyName> =
  K extends `${infer Parent}.${infer Child}` ? [Parent, Child] : [K];

function splitSocioEconomicKey<K extends SocioEconomicImpactImpactKeyName>(
  key: K,
): SplitSocioKey<K> {
  return key.split(".") as SplitSocioKey<K>;
}

const extractImpact = (
  impactsByBearer: SocioEconomicImpactsByBearerListView,
  sectionName: SocioEconomicSubSectionName,
  keyName: SocioEconomicImpactImpactKeyName,
): SocioEconomicModalData | undefined => {
  const [impactKeyName, impactDetailsKeyName] = splitSocioEconomicKey(keyName);

  if (impactDetailsKeyName) {
    const impact = impactsByBearer[sectionName].impacts.find(
      (item) => item.keyName === impactKeyName,
    );
    const total =
      impact && "details" in impact
        ? impact.details.find((d) => d.keyName === keyName)?.total
        : undefined;
    return total ? { total: total } : undefined;
  }

  const impact = impactsByBearer[sectionName].impacts.find((item) => item.keyName === keyName);

  if (!impact) {
    return undefined;
  }

  return {
    ...impact,
    details:
      "details" in impact
        ? impact?.details?.map(({ total, keyName }) => ({
            label: getSocioEconomicImpactLabel(keyName),
            color: getSocioEconomicImpactColor(keyName) ?? "",
            value: total,
            name: keyName,
          }))
        : undefined,
  };
};

type SocioEconomicModalData = {
  total: number;
  bearerName?: string;
  details?: {
    label: string;
    color: string;
    value: number;
    name: SocioEconomicDetailsName;
  }[];
};
export const SOCIO_ECONOMIC_MODALS = {
  projectedRentalIncome: {
    title: "🔑 Revenu locatif",
    description: "répartis entre l'actuel propriétaire et le futur propriétaire",
    Component: () => import("./mdx/projected_rental_income.mdx"),
  },
  avoidedFricheMaintenanceAndSecuringCostsForOwner: {
    title: "🏚️ Dépenses liées à la friche évitées pour le propriétaire",
    Component: () => import("./mdx/avoided_friche_maintenance_and_securing_costs.mdx"),
  },
  avoidedFricheMaintenanceAndSecuringCostsForTenant: {
    title: "🏚️ Dépenses liées à la friche évitées pour le locataire",
    subtitle: "Grâce à la reconversion de la friche",
    Component: () => import("./mdx/avoided_friche_maintenance_and_securing_costs.mdx"),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForOwner.accidentsCost": undefined,
  "avoidedFricheMaintenanceAndSecuringCostsForTenant.accidentsCost": undefined,
  "avoidedFricheMaintenanceAndSecuringCostsForOwner.illegalDumpingCost": {
    title: "🚮 Débarras de dépôt sauvage",

    Component: () =>
      import("./mdx/avoided_friche_maintenance_and_securing_costs__illegal_dumping_cost.mdx"),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForTenant.illegalDumpingCost": {
    title: "🚮 Débarras de dépôt sauvage",

    Component: () =>
      import("./mdx/avoided_friche_maintenance_and_securing_costs__illegal_dumping_cost.mdx"),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForOwner.maintenance": {
    title: "🔧 Entretien",

    Component: () => import("./mdx/avoided_friche_maintenance_and_securing_costs__maintenance.mdx"),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForTenant.maintenance": {
    title: "🔧 Entretien",

    Component: () => import("./mdx/avoided_friche_maintenance_and_securing_costs__maintenance.mdx"),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForOwner.otherSecuringCosts": {
    title: "🛡 Autres dépenses de sécurisation",

    Component: () =>
      import("./mdx/avoided_friche_maintenance_and_securing_costs__other_securing_costs.mdx"),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForTenant.otherSecuringCosts": {
    title: "🛡 Autres dépenses de sécurisation",

    Component: () =>
      import("./mdx/avoided_friche_maintenance_and_securing_costs__other_securing_costs.mdx"),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForOwner.security": {
    title: "👮 Gardiennage",

    Component: () => import("./mdx/avoided_friche_maintenance_and_securing_costs__security.mdx"),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForTenant.security": {
    title: "👮 Gardiennage",

    Component: () => import("./mdx/avoided_friche_maintenance_and_securing_costs__security.mdx"),
  },
  projectOperatingExpenses: undefined,
  "projectOperatingExpenses.rent": undefined,
  "projectOperatingExpenses.taxes": undefined,
  "projectOperatingExpenses.other": undefined,

  projectOperatingRevenues: undefined,
  "projectOperatingRevenues.operations": undefined,
  "projectOperatingRevenues.rent": undefined,
  "projectOperatingRevenues.other": undefined,
  "projectOperatingExpenses.maintenance": undefined,

  propertyTransferDutiesIncome: undefined,

  localPropertyValueIncrease: {
    title: "🏡 Hausse de la valeur patrimoniale des bâtiments alentour",
    subtitle: "Grâce à la reconversion du site",
    description: "pour la population locale",
    Component: () => import("./mdx/local_property_value_increase.mdx"),
  },
  localTransferDutiesIncrease: {
    title: "🏛️ Droits de mutation sur les ventes immobilières alentour",
    description: "pour la collectivité",
    Component: () => import("./mdx/local_transfer_duties_increase.mdx"),
  },
  taxesIncome: {
    title: "🏛️ Recettes fiscales",
    description: "pour la collectivité",
    Component: () => import("./mdx/taxes_income.mdx"),
  },

  "taxesIncome.projectNewCompanyTaxationIncome": undefined,
  "taxesIncome.projectNewHousesTaxesIncome": undefined,
  "taxesIncome.projectPhotovoltaicTaxesIncome": undefined,

  previousSiteOperationBenefitLoss: undefined,

  avoidedPropertyDamageExpenses: {
    title: "🚙 Dépenses de réparation évitées",
    subtitle: "Grâce aux déplacements évités",
    Component: () => import("./mdx/avoided_property_damage_expenses.mdx"),
  },
  avoidedCarRelatedExpenses: {
    title: "🚗 Dépenses automobiles évitées",
    subtitle: "Grâce à la ou les commodités créées dans le quartier",
    description: "pour la population locale",
    Component: () => import("./mdx/avoided_car_related_expenses.mdx"),
  },
  avoidedAirConditioningExpenses: {
    title: "❄️ Dépenses de climatisation évitées",
    description: "pour la population locale et les structures locales",
    Component: () => import("./mdx/avoided_air_conditioning_expenses.mdx"),
  },
  fricheRoadsAndUtilitiesExpenses: {
    title: "🅿️ Dépenses d’entretien des VRD",
    description: "pour la collectivité",
    Component: () => import("./mdx/friche_roads_and_utilities_expenses.mdx"),
  },
  travelTimeSavedPerTravelerExpenses: {
    title: "⏱️️ Valeur monétaire du temps passé en moins dans les transports",
    subtitle: "Grâce à la ou les commodités créées dans le quartier",
    description: "pour la population locale",
    Component: () => import("./mdx/travel_time_saved_per_traveler_expenses.mdx"),
  },
  avoidedTrafficAccidents: {
    title: "🚗 Dépenses de santé évitées grâce à la diminution des accidents de la route",
    Component: () => import("./mdx/avoided_traffic_accidents.mdx"),
  },
  "avoidedTrafficAccidents.avoidedAccidentsDeathsExpenses": {
    title: "🪦 Décès évités",
    subtitle: "Grâce aux déplacements évités",
    Component: () =>
      import("./mdx/avoided_traffic_accidents__avoided_accidents_deaths_expenses.mdx"),
  },
  "avoidedTrafficAccidents.avoidedAccidentsMinorInjuriesExpenses": {
    title: "🤕 Blessés légers évités",
    subtitle: "Grâce aux déplacements évités",

    Component: () =>
      import("./mdx/avoided_traffic_accidents__avoided_accidents_minor_injuries_expenses.mdx"),
  },
  "avoidedTrafficAccidents.avoidedAccidentsSevereInjuriesExpenses": {
    title: "‍🚑 Blessés graves évités",
    subtitle: "Grâce aux déplacements évités",

    Component: () =>
      import("./mdx/avoided_traffic_accidents__avoided_accidents_severe_injuries_expenses.mdx"),
  },
  avoidedCo2eqEmissions: {
    title: "☁️ Valeur monétaire de la décarbonation",
    description: "pour l'humanité",
    Component: () => import("./mdx/avoided_co2eq_emissions.mdx"),
  },
  "avoidedCo2eqEmissions.avoidedCo2eqWithEnergyProduction": {
    title: "⚡️️ Production d'énergies renouvelables",
    description: "pour l'humanité",
    Component: () =>
      import("./mdx/avoided_co2eq_emissions__avoided_co2eq_with_energy_production.mdx"),
  },
  "avoidedCo2eqEmissions.avoidedTrafficCo2EqEmissions": {
    title: "🚙 Déplacements en voiture évités",
    description: "pour l'humanité",
    Component: () => import("./mdx/avoided_co2eq_emissions__avoided_traffic_co2_eq_emissions.mdx"),
  },
  "avoidedCo2eqEmissions.avoidedAirConditioningCo2eqEmissions": {
    title: "❄️ Utilisation réduite de de la climatisation",
    description: "pour l'humanité",
    Component: () =>
      import("./mdx/avoided_co2eq_emissions__avoided_air_conditioning_co2eq_emissions.mdx"),
  },
  avoidedAirPollutionHealthExpenses: {
    title: "💨 Dépenses de santé évitées grâce à la réduction de la pollution de l’air",
    subtitle: "Grâce aux déplacements évités",
    description: "pour la société française",
    Component: () => import("./mdx/avoided_air_pollution_health_expenses.mdx"),
  },
  waterRegulation: {
    title: "🚰 Dépenses de traitement de l’eau évitées",
    subtitle:
      "Grâce à la dépollution de la friche et à la régulation de la qualité de l’eau par les espaces naturels",
    description: "pour la collectivité",
    Component: () => import("./mdx/water_regulation.mdx"),
  },
  ecosystemServices: {
    title: "🌱 Valeur monétaire des services écosystémiques",
    description: "pour l'humanité",
    Component: () => import("./mdx/ecosystem_services.mdx"),
  },
  "ecosystemServices.forestRelatedProduct": {
    title: "🪵 Produits issus de la forêt",
    description: "pour l'humanité",
    Component: () => import("./mdx/ecosystem_services__forest_related_product.mdx"),
  },
  "ecosystemServices.invasiveSpeciesRegulation": {
    title: "🦔 Régulation des espèces invasives",
    description: "pour l'humanité",
    Component: () => import("./mdx/ecosystem_services__invasive_species_regulation.mdx"),
  },
  "ecosystemServices.natureRelatedWelnessAndLeisure": {
    title: "🚵 Bien-être et loisirs liés à la nature",
    description: "pour l'humanité",
    Component: () => import("./mdx/ecosystem_services__nature_related_welness_and_leisure.mdx"),
  },
  "ecosystemServices.nitrogenCycle": {
    title: "🍄 Cycle de l'azote",
    description: "pour l'humanité",
    Component: () => import("./mdx/ecosystem_services__nitrogen_cycle.mdx"),
  },
  "ecosystemServices.pollination": {
    title: "🐝 Pollinisation",
    description: "pour l'humanité",
    Component: () => import("./mdx/ecosystem_services__pollination.mdx"),
  },
  "ecosystemServices.soilErosion": {
    title: "🌾 Régulation de l'érosion des sols",
    Component: () => import("./mdx/ecosystem_services__soil_erosion.mdx"),
  },
  "ecosystemServices.waterCycle": {
    title: "💧 Cycle de l'eau",
    description: "pour l'humanité",
    Component: () => import("./mdx/ecosystem_services__water_cycle.mdx"),
  },
  "ecosystemServices.newStoredCo2Eq": {
    title: "🍂️ CO2-eq stocké dans les sols",
    description: "pour l'humanité",
    Component: () => import("./mdx/ecosystem_services__new_stored_co2_eq.mdx"),
  },
  oldRentalIncomeLoss: undefined,
} as const satisfies Record<
  SocioEconomicImpactImpactKeyName,
  | {
      title: string;
      subtitle?: string;
      description?: string;
      Component: LazyContentComponent;
    }
  | undefined
>;

export function SocioEconomicModalWizard({
  impactName,
  impactDetailsName,
  impactSubSectionName,
  impactsData,
  contextData,
}: Props) {
  const { stakeholders, aggregatedReconversionImpacts } = impactsData;

  const indirectEconomicImpactsByBearer =
    groupIndirectEconomicImpactsByBearerAndCategory<AggregatedReconversionProjectOnSiteImpactItemView>(
      {
        indirectEconomicImpacts: aggregatedReconversionImpacts.indirectEconomicImpacts.details,
        indirectEconomicImpactsTotal: aggregatedReconversionImpacts.indirectEconomicImpacts.total,
        stakeholders,
      },
    );

  const indirectEconomicImpactsByBearerAndCategory =
    getSocioEconomicProjectImpactsGroupedByCategory(
      aggregatedReconversionImpacts.indirectEconomicImpacts,
      stakeholders,
    );

  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const breadcrumbProps = {
    section: {
      label: "Impacts socio-économiques",
      contentState: { sectionName: "socio_economic" as const },
    },
    segments: impactSubSectionName
      ? impactDetailsName && impactName
        ? [
            getSubSectionBreadcrumb(impactSubSectionName),
            {
              label: getSocioEconomicImpactLabel(impactName),
              contentState: {
                sectionName: "socio_economic" as const,
                subSectionName: impactSubSectionName,
                impactName,
              },
            },
          ]
        : [getSubSectionBreadcrumb(impactSubSectionName)]
      : [],
  };

  const config = useMemo(() => {
    return impactName ? SOCIO_ECONOMIC_MODALS[impactDetailsName ?? impactName] : undefined;
  }, [impactName, impactDetailsName]);

  if (!impactSubSectionName) {
    return (
      <SocioEconomicDescription
        impactsData={{
          byBearerAndCategory: indirectEconomicImpactsByBearer,
          total: indirectEconomicImpactsByBearerAndCategory.total,
        }}
      />
    );
  }
  if (!impactName) {
    switch (impactSubSectionName) {
      case "humanity":
        return <HumanityDescription impactsData={indirectEconomicImpactsByBearer.humanity} />;

      case "localAuthority":
        return (
          <LocalAuthorityDescription impactsData={indirectEconomicImpactsByBearer.localAuthority} />
        );
      case "localPeopleOrCompany":
        return (
          <LocalPeopleOrCompanyDescription
            impactsData={indirectEconomicImpactsByBearer.localPeopleOrCompany}
          />
        );
    }
  }

  if (!config) {
    return (
      <ImpactInProgressDescriptionModal
        title={getSocioEconomicImpactLabel(impactDetailsName ?? impactName)}
        breadcrumbProps={breadcrumbProps}
      />
    );
  }

  const { Component, title } = config;

  const data = extractImpact(
    indirectEconomicImpactsByBearerAndCategory,
    impactSubSectionName,
    impactDetailsName ?? impactName,
  );

  return (
    <Suspense fallback={<LoadingSpinner classes={{ text: "text-grey-light" }} />}>
      <ModalBody size="large">
        <ModalHeader
          title={title}
          subtitle={"subtitle" in config ? config.subtitle : undefined}
          value={
            data?.total
              ? {
                  state: data?.total > 0 ? "success" : "error",
                  text: formatMonetaryImpact(data?.total),
                  description:
                    "description" in config
                      ? config.description
                      : data.bearerName
                        ? `pour ${data.bearerName}`
                        : undefined,
                }
              : undefined
          }
          breadcrumbSegments={[
            breadcrumbProps.section,
            ...breadcrumbProps.segments,
            { label: title },
          ]}
        />
        <ModalGrid>
          {data?.details && (
            <ModalData>
              <ModalColumnPointChart
                format="monetary"
                data={data.details}
                exportTitle={title}
                exportSubtitle={"subtitle" in config ? config.subtitle : undefined}
              />

              <ModalTable
                caption={`Liste détaillée des dépenses et recettes de ${title}`}
                data={data.details.map(({ label, value, color, name }) => ({
                  label,
                  value,
                  color,
                  onClick: () => {
                    updateModalContent({
                      sectionName: "socio_economic",
                      subSectionName: impactSubSectionName,
                      impactName: impactName,
                      impactDetailsName: name,
                    });
                  },
                }))}
              />
            </ModalData>
          )}
          <ModalContent>
            <LazyContent
              contextData={contextData}
              impactsData={impactsData}
              withMonetarisation={true}
              Component={Component}
            />
          </ModalContent>
        </ModalGrid>
      </ModalBody>
    </Suspense>
  );
}
