import {
  AvoidedCO2EqEmissions,
  AvoidedFricheCostsImpact,
  AvoidedTrafficAccidentsImpact,
  ComparisonRentalIncomeImpact,
  ComparisonSiteFricheCostsImpact,
  ComparisonTaxesIncomesImpact,
  EcosystemServicesImpact,
  sumListWithKey,
  UrbanSprawlComparisonImpacts,
  UrbanSprawlComparisonSocioEconomicImpacts,
} from "shared";

import { SocioEconomicImpactName } from "@/features/projects/domain/projectImpactsSocioEconomic";

import { getSocioEconomicImpactLabel as getSocioEconomicProjectImpactLabel } from "../../../project-page/impacts/getImpactLabel";
import { formatMonetaryImpact } from "../../../shared/formatImpactValue";
import { getActorLabel } from "../../../shared/socioEconomicLabels";
import TableAccordionRow from "../layout/TableAccordionRows";
import ImpactComparisonTableRow from "../layout/TableRow";
import ImpactComparisonTableSectionRow from "../layout/TableSectionRow";
import ImpactComparisonTableSeparatorRow from "../layout/TableSeparatorRow";

type Props = {
  baseCase: {
    impacts: UrbanSprawlComparisonImpacts;
    siteName: string;
  };
  comparisonCase: {
    impacts: UrbanSprawlComparisonImpacts;
    siteName: string;
  };
};

type ImpactName =
  | UrbanSprawlComparisonSocioEconomicImpacts["impact"]
  | ComparisonRentalIncomeImpact["details"][number]["impact"]
  | ComparisonSiteFricheCostsImpact["details"][number]["impact"]
  | ComparisonTaxesIncomesImpact["details"][number]["impact"]
  | AvoidedFricheCostsImpact["details"][number]["impact"]
  | AvoidedTrafficAccidentsImpact["details"][number]["impact"]
  | AvoidedCO2EqEmissions["details"][number]["impact"]
  | EcosystemServicesImpact["details"][number]["impact"];

const getSocioEconomicImpactLabel = (impact: ImpactName) => {
  switch (impact) {
    case "avoided_roads_and_utilities_maintenance_expenses":
      return "🅿️ Dépenses d'entretien et maintenance des VRD évités";
    case "roads_and_utilities_maintenance_expenses":
      return "🅿️ Dépenses d'entretien et maintenance des VRD supplémentaires";
    case "avoided_roads_and_utilities_construction_expenses":
      return "🏗 Dépenses de travaux de VRD évitées";
    case "statu_quo_friche_costs":
      return "🏚 Dépenses de gestion et de sécurisation de la friche";
    case "roads_and_utilities_construction_expenses":
      return "🏗 Dépenses de travaux de VRD";
    case "local_property_value_increase":
      return "🏡 Valeur patrimoniale des bâtiments autour du site";
    case "local_transfer_duties_increase":
      return "🏛 Droits de mutation sur les ventes immobilières autour du site";
    case "project_rental_income":
      return "🔑 Revenu locatif du site converti";
    case "site_statu_quo_rental_income":
      return "🔑 Revenu locatif du site non converti";
    case "site_statu_quo_accidents_costs":
      return "💥 Accidents";
    case "site_statu_quo_illegal_dumping_costs":
      return "🚮 Débarras de dépôt sauvage";
    case "site_statu_quo_maintenance_costs":
      return "🔧 Entretien";
    case "site_statu_quo_other_securing_costs":
      return "🛡 Autres dépenses de sécurisation";
    case "site_statu_quo_security_costs":
      return "👮 Gardiennage";
    case "site_statu_quo_property_taxes":
      return "🏛 Taxe foncière du site non converti";
    case "site_statu_quo_operation_taxes":
      return "🏛 Taxes d'exploitation du site non converti";
    case "site_statu_quo_taxes":
      return "🏛 Impôts et taxes du site non converti";
    default:
      return getSocioEconomicProjectImpactLabel(impact);
  }
};

const economicDirectCategories = [
  "rental_income",
  "avoided_friche_costs",
  "statu_quo_friche_costs",
  "property_transfer_duties_income",
  "avoided_roads_and_utilities_construction_expenses",
  "roads_and_utilities_construction_expenses",
] as const satisfies UrbanSprawlComparisonSocioEconomicImpacts["impact"][];

const economicIndirectCategories = [
  "taxes_income",
  "avoided_car_related_expenses",
  "avoided_air_conditioning_expenses",
  "site_operation_benefits_loss",
  "avoided_property_damages_expenses",
  "local_property_value_increase",
  "local_transfer_duties_increase",
  "avoided_roads_and_utilities_maintenance_expenses",
  "roads_and_utilities_maintenance_expenses",
] as const satisfies UrbanSprawlComparisonSocioEconomicImpacts["impact"][];

const socialMonetaryCategories = [
  "travel_time_saved",
  "avoided_traffic_accidents",
  "avoided_air_pollution",
] as const satisfies UrbanSprawlComparisonSocioEconomicImpacts["impact"][];

const environmentalMonetaryCategories = [
  "avoided_co2_eq_emissions",
  "water_regulation",
  "ecosystem_services",
] as const satisfies UrbanSprawlComparisonSocioEconomicImpacts["impact"][];

const ecosystemServicesDetails = [
  "nature_related_wellness_and_leisure",
  "forest_related_product",
  "pollination",
  "invasive_species_regulation",
  "water_cycle",
  "nitrogen_cycle",
  "soil_erosion",
  "soils_co2_eq_storage",
] as const satisfies SocioEconomicImpactName[];

const taxesIncomesDetails = [
  "project_new_houses_taxes_income",
  "project_new_company_taxation_income",
  "project_photovoltaic_taxes_income",
  "site_statu_quo_taxes",
  "site_statu_quo_property_taxes",
  "site_statu_quo_operation_taxes",
] as const satisfies ComparisonTaxesIncomesImpact["details"][number]["impact"][];

const trafficAccidentsDetails = [
  "avoided_traffic_minor_injuries",
  "avoided_traffic_severe_injuries",
  "avoided_traffic_deaths",
] as const satisfies SocioEconomicImpactName[];

const avoidedCo2eqEmissionsDetails = [
  "avoided_co2_eq_with_enr",
  "avoided_traffic_co2_eq_emissions",
  "avoided_air_conditioning_co2_eq_emissions",
] as const satisfies SocioEconomicImpactName[];

const avoidedFricheCostsDetails = [
  "avoided_security_costs",
  "avoided_illegal_dumping_costs",
  "avoided_accidents_costs",
  "avoided_other_securing_costs",
  "avoided_maintenance_costs",
] as const satisfies AvoidedFricheCostsImpact["details"][number]["impact"][];

const statuQuoFricheCostsDetails = [
  "site_statu_quo_security_costs",
  "site_statu_quo_illegal_dumping_costs",
  "site_statu_quo_accidents_costs",
  "site_statu_quo_other_securing_costs",
  "site_statu_quo_maintenance_costs",
] as const satisfies ComparisonSiteFricheCostsImpact["details"][number]["impact"][];

const rentalIncomeDetails = [
  "project_rental_income",
  "site_statu_quo_rental_income",
] as const satisfies ComparisonRentalIncomeImpact["details"][number]["impact"][];

function groupBy<T, K extends keyof T>(array: T[], key: K) {
  const map = new Map<T[K], T[]>();
  array.forEach((item) => {
    const itemKey = item[key];
    if (!map.has(itemKey)) {
      map.set(
        itemKey,
        array.filter((i) => i[key] === item[key]),
      );
    }
  });
  return map;
}
const ImpactComparisonListSocioEconomicSection = ({ baseCase, comparisonCase }: Props) => {
  const formatValueFn = formatMonetaryImpact;

  return (
    <ImpactComparisonTableSectionRow
      label="Impacts socio-économiques"
      baseValue={baseCase.impacts.socioeconomic.total}
      comparisonValue={comparisonCase.impacts.socioeconomic.total}
    >
      {(() => {
        const baseEconomicDirect = baseCase.impacts.socioeconomic.impacts.filter(
          ({ impactCategory }) => impactCategory === "economic_direct",
        );
        const comparisonEconomicDirect = comparisonCase.impacts.socioeconomic.impacts.filter(
          ({ impactCategory }) => impactCategory === "economic_direct",
        );
        if (baseEconomicDirect.length === 0 && comparisonEconomicDirect.length === 0) {
          return null;
        }
        return (
          <ImpactComparisonTableSectionRow
            label="Impacts économiques directs"
            subSection
            baseValue={sumListWithKey(baseEconomicDirect, "amount")}
            comparisonValue={sumListWithKey(comparisonEconomicDirect, "amount")}
          >
            {economicDirectCategories.map((category) => {
              switch (category) {
                case "avoided_friche_costs": {
                  const base = baseCase.impacts.socioeconomic.impacts.filter(
                    (impact): impact is AvoidedFricheCostsImpact => impact.impact === category,
                  );
                  const comparison = comparisonCase.impacts.socioeconomic.impacts.filter(
                    (impact): impact is AvoidedFricheCostsImpact => impact.impact === category,
                  );

                  if (base.length === 0 && comparison.length === 0) {
                    return null;
                  }

                  const baseByActor = groupBy(base, "actor");
                  const comparisonByActor = groupBy(comparison, "actor");

                  const actors = [
                    ...new Set(
                      Array.from(baseByActor.keys()).concat(Array.from(comparisonByActor.keys())),
                    ),
                  ];

                  return actors.map((actor) => {
                    const [baseForActor] = baseByActor.get(actor) ?? [];
                    const [comparisonForActor] = comparisonByActor.get(actor) ?? [];
                    return (
                      <>
                        <TableAccordionRow
                          key={actor}
                          actor={getActorLabel(actor)}
                          label={getSocioEconomicImpactLabel("avoided_friche_costs")}
                          baseValue={baseForActor?.amount ?? 0}
                          comparisonValue={comparisonForActor?.amount ?? 0}
                          formatValueFn={formatValueFn}
                        >
                          {avoidedFricheCostsDetails
                            .map((detailsCategory) => ({
                              category: detailsCategory,
                              base: baseForActor?.details.find(
                                (item) => item.impact === detailsCategory,
                              )?.amount,
                              comparison: comparisonForActor?.details.find(
                                (item) => item.impact === detailsCategory,
                              )?.amount,
                            }))
                            .filter((item) => item.base || item.comparison)
                            .map((row, detailsIndex, currentArray) => (
                              <ImpactComparisonTableRow
                                key={row.category}
                                label={getSocioEconomicImpactLabel(row.category)}
                                isLast={detailsIndex === currentArray.length - 1}
                                baseValue={row.base ?? 0}
                                comparisonValue={row.comparison ?? 0}
                                formatValueFn={formatValueFn}
                              />
                            ))}
                        </TableAccordionRow>
                        <ImpactComparisonTableSeparatorRow />
                      </>
                    );
                  });
                }
                case "statu_quo_friche_costs": {
                  const base = baseCase.impacts.socioeconomic.impacts.filter(
                    (impact): impact is ComparisonSiteFricheCostsImpact =>
                      impact.impact === category,
                  );
                  const comparison = comparisonCase.impacts.socioeconomic.impacts.filter(
                    (impact): impact is ComparisonSiteFricheCostsImpact =>
                      impact.impact === category,
                  );

                  if (base.length === 0 && comparison.length === 0) {
                    return null;
                  }

                  const baseByActor = groupBy(base, "actor");
                  const comparisonByActor = groupBy(comparison, "actor");

                  const actors = [
                    ...new Set(
                      Array.from(baseByActor.keys()).concat(Array.from(comparisonByActor.keys())),
                    ),
                  ];

                  return actors.map((actor) => {
                    const [baseForActor] = baseByActor.get(actor) ?? [];
                    const [comparisonForActor] = comparisonByActor.get(actor) ?? [];
                    return (
                      <>
                        <TableAccordionRow
                          key={actor}
                          actor={getActorLabel(actor)}
                          label={getSocioEconomicImpactLabel(category)}
                          baseValue={baseForActor?.amount ?? 0}
                          comparisonValue={comparisonForActor?.amount ?? 0}
                          formatValueFn={formatValueFn}
                        >
                          {statuQuoFricheCostsDetails
                            .map((detailsCategory) => ({
                              category: detailsCategory,
                              base: baseForActor?.details.find(
                                (item) => item.impact === detailsCategory,
                              )?.amount,
                              comparison: comparisonForActor?.details.find(
                                (item) => item.impact === detailsCategory,
                              )?.amount,
                            }))
                            .filter((item) => item.base || item.comparison)
                            .map((row, detailsIndex, currentArray) => (
                              <ImpactComparisonTableRow
                                key={row.category}
                                label={getSocioEconomicImpactLabel(row.category)}
                                isLast={detailsIndex === currentArray.length - 1}
                                baseValue={row.base ?? 0}
                                comparisonValue={row.comparison ?? 0}
                                formatValueFn={formatValueFn}
                              />
                            ))}
                        </TableAccordionRow>
                        <ImpactComparisonTableSeparatorRow />
                      </>
                    );
                  });
                }
                case "rental_income": {
                  const base = baseCase.impacts.socioeconomic.impacts.filter(
                    (impact): impact is ComparisonRentalIncomeImpact => impact.impact === category,
                  );
                  const comparison = comparisonCase.impacts.socioeconomic.impacts.filter(
                    (impact): impact is ComparisonRentalIncomeImpact => impact.impact === category,
                  );

                  if (base.length === 0 && comparison.length === 0) {
                    return null;
                  }

                  const baseByActor = groupBy(base, "actor");
                  const comparisonByActor = groupBy(comparison, "actor");

                  const actors = [
                    ...new Set(
                      Array.from(baseByActor.keys()).concat(Array.from(comparisonByActor.keys())),
                    ),
                  ];

                  return actors.map((actor) => {
                    const [baseForActor] = baseByActor.get(actor) ?? [];
                    const [comparisonForActor] = comparisonByActor.get(actor) ?? [];
                    return (
                      <>
                        <TableAccordionRow
                          key={actor}
                          actor={getActorLabel(actor)}
                          label={getSocioEconomicImpactLabel(category)}
                          baseValue={baseForActor?.amount ?? 0}
                          comparisonValue={comparisonForActor?.amount ?? 0}
                          formatValueFn={formatValueFn}
                        >
                          {rentalIncomeDetails
                            .map((detailsCategory) => ({
                              category: detailsCategory,
                              base: baseForActor?.details.find(
                                (item) => item.impact === detailsCategory,
                              )?.amount,
                              comparison: comparisonForActor?.details.find(
                                (item) => item.impact === detailsCategory,
                              )?.amount,
                            }))
                            .filter((item) => item.base || item.comparison)
                            .map((row, detailsIndex, currentArray) => (
                              <ImpactComparisonTableRow
                                key={row.category}
                                label={getSocioEconomicImpactLabel(row.category)}
                                isLast={detailsIndex === currentArray.length - 1}
                                baseValue={row.base ?? 0}
                                comparisonValue={row.comparison ?? 0}
                                formatValueFn={formatValueFn}
                              />
                            ))}
                        </TableAccordionRow>
                        <ImpactComparisonTableSeparatorRow />
                      </>
                    );
                  });
                }

                case "avoided_roads_and_utilities_construction_expenses":
                case "roads_and_utilities_construction_expenses":
                case "property_transfer_duties_income": {
                  const base = baseCase.impacts.socioeconomic.impacts.find(
                    ({ impact }) => impact === category,
                  );
                  const comparison = comparisonCase.impacts.socioeconomic.impacts.find(
                    ({ impact }) => impact === category,
                  );

                  if (!base && !comparison) {
                    return null;
                  }
                  return (
                    <>
                      <ImpactComparisonTableRow
                        label={getSocioEconomicImpactLabel(category)}
                        isFirst
                        isLast
                        actor={getActorLabel(base?.actor ?? comparison?.actor ?? "")}
                        baseValue={base?.amount ?? 0}
                        comparisonValue={comparison?.amount ?? 0}
                        formatValueFn={formatValueFn}
                      />
                      <ImpactComparisonTableSeparatorRow />
                    </>
                  );
                }
              }
            })}
          </ImpactComparisonTableSectionRow>
        );
      })()}

      {(() => {
        const baseEconomicIndirect = baseCase.impacts.socioeconomic.impacts.filter(
          ({ impactCategory }) => impactCategory === "economic_indirect",
        );
        const comparisonEconomicIndirect = comparisonCase.impacts.socioeconomic.impacts.filter(
          ({ impactCategory }) => impactCategory === "economic_indirect",
        );
        if (baseEconomicIndirect.length === 0 && comparisonEconomicIndirect.length === 0) {
          return null;
        }
        return (
          <ImpactComparisonTableSectionRow
            label="Impacts économiques indirects"
            subSection
            baseValue={sumListWithKey(baseEconomicIndirect, "amount")}
            comparisonValue={sumListWithKey(comparisonEconomicIndirect, "amount")}
          >
            {economicIndirectCategories.map((category) => {
              switch (category) {
                case "taxes_income": {
                  const base = baseCase.impacts.socioeconomic.impacts.find(
                    (impact): impact is ComparisonTaxesIncomesImpact => impact.impact === category,
                  );
                  const comparison = comparisonCase.impacts.socioeconomic.impacts.find(
                    (impact): impact is ComparisonTaxesIncomesImpact => impact.impact === category,
                  );
                  if (!base && !comparison) {
                    return null;
                  }
                  return (
                    <>
                      <TableAccordionRow
                        label={getSocioEconomicImpactLabel(category)}
                        actor={getActorLabel(base?.actor ?? comparison?.actor ?? "")}
                        baseValue={base?.amount ?? 0}
                        comparisonValue={comparison?.amount ?? 0}
                        formatValueFn={formatValueFn}
                      >
                        {taxesIncomesDetails
                          .map((detailsCategory) => ({
                            category: detailsCategory,
                            base: base?.details.find((item) => item.impact === detailsCategory)
                              ?.amount,
                            comparison: comparison?.details.find(
                              (item) => item.impact === detailsCategory,
                            )?.amount,
                          }))
                          .filter((item) => item.base || item.comparison)
                          .map((row, detailsIndex, currentArray) => (
                            <ImpactComparisonTableRow
                              key={row.category}
                              label={getSocioEconomicImpactLabel(row.category)}
                              isLast={detailsIndex === currentArray.length - 1}
                              baseValue={row.base ?? 0}
                              comparisonValue={row.comparison ?? 0}
                              formatValueFn={formatValueFn}
                            />
                          ))}
                      </TableAccordionRow>
                      <ImpactComparisonTableSeparatorRow />
                    </>
                  );
                }
                case "avoided_air_conditioning_expenses":
                case "avoided_car_related_expenses":
                case "avoided_property_damages_expenses":
                case "avoided_roads_and_utilities_maintenance_expenses":
                case "local_property_value_increase":
                case "local_transfer_duties_increase":
                case "roads_and_utilities_maintenance_expenses":
                case "site_operation_benefits_loss": {
                  const base = baseCase.impacts.socioeconomic.impacts.find(
                    ({ impact }) => impact === category,
                  );
                  const comparison = comparisonCase.impacts.socioeconomic.impacts.find(
                    ({ impact }) => impact === category,
                  );

                  if (!base && !comparison) {
                    return null;
                  }
                  return (
                    <>
                      <ImpactComparisonTableRow
                        label={getSocioEconomicImpactLabel(category)}
                        isFirst
                        isLast
                        actor={getActorLabel(base?.actor ?? comparison?.actor ?? "")}
                        baseValue={base?.amount ?? 0}
                        comparisonValue={comparison?.amount ?? 0}
                        formatValueFn={formatValueFn}
                      />
                      <ImpactComparisonTableSeparatorRow />
                    </>
                  );
                }
              }
            })}
          </ImpactComparisonTableSectionRow>
        );
      })()}

      {(() => {
        const baseTotal = baseCase.impacts.socioeconomic.impacts.filter(
          ({ impactCategory }) => impactCategory === "social_monetary",
        );
        const comparisonTotal = comparisonCase.impacts.socioeconomic.impacts.filter(
          ({ impactCategory }) => impactCategory === "social_monetary",
        );
        if (baseTotal.length === 0 && comparisonTotal.length === 0) {
          return null;
        }
        return (
          <ImpactComparisonTableSectionRow
            label="Impacts sociaux monétarisés"
            subSection
            baseValue={sumListWithKey(baseTotal, "amount")}
            comparisonValue={sumListWithKey(comparisonTotal, "amount")}
          >
            {socialMonetaryCategories.map((category) => {
              switch (category) {
                case "avoided_traffic_accidents": {
                  const base = baseCase.impacts.socioeconomic.impacts.find(
                    (impact): impact is AvoidedTrafficAccidentsImpact => impact.impact === category,
                  );
                  const comparison = comparisonCase.impacts.socioeconomic.impacts.find(
                    (impact): impact is AvoidedTrafficAccidentsImpact => impact.impact === category,
                  );
                  if (!base && !comparison) {
                    return null;
                  }
                  return (
                    <>
                      <TableAccordionRow
                        label={getSocioEconomicImpactLabel(category)}
                        actor={getActorLabel(base?.actor ?? comparison?.actor ?? "")}
                        baseValue={base?.amount ?? 0}
                        comparisonValue={comparison?.amount ?? 0}
                        formatValueFn={formatValueFn}
                      >
                        {trafficAccidentsDetails
                          .map((detailsCategory) => ({
                            category: detailsCategory,
                            base: base?.details.find((item) => item.impact === detailsCategory)
                              ?.amount,
                            comparison: comparison?.details.find(
                              (item) => item.impact === detailsCategory,
                            )?.amount,
                          }))
                          .filter((item) => item.base || item.comparison)
                          .map((row, detailsIndex, currentArray) => (
                            <ImpactComparisonTableRow
                              key={row.category}
                              label={getSocioEconomicImpactLabel(row.category)}
                              isLast={detailsIndex === currentArray.length - 1}
                              baseValue={row.base ?? 0}
                              comparisonValue={row.comparison ?? 0}
                              formatValueFn={formatValueFn}
                            />
                          ))}
                      </TableAccordionRow>
                      <ImpactComparisonTableSeparatorRow />
                    </>
                  );
                }
                case "avoided_air_pollution":
                case "travel_time_saved": {
                  const base = baseCase.impacts.socioeconomic.impacts.find(
                    ({ impact }) => impact === category,
                  );
                  const comparison = comparisonCase.impacts.socioeconomic.impacts.find(
                    ({ impact }) => impact === category,
                  );

                  if (!base && !comparison) {
                    return null;
                  }
                  return (
                    <>
                      <ImpactComparisonTableRow
                        label={getSocioEconomicImpactLabel(category)}
                        isFirst
                        isLast
                        actor={getActorLabel(base?.actor ?? comparison?.actor ?? "")}
                        baseValue={base?.amount ?? 0}
                        comparisonValue={comparison?.amount ?? 0}
                        formatValueFn={formatValueFn}
                      />
                      <ImpactComparisonTableSeparatorRow />
                    </>
                  );
                }
              }
            })}
          </ImpactComparisonTableSectionRow>
        );
      })()}

      {(() => {
        const baseTotal = baseCase.impacts.socioeconomic.impacts.filter(
          ({ impactCategory }) => impactCategory === "environmental_monetary",
        );
        const comparisonTotal = comparisonCase.impacts.socioeconomic.impacts.filter(
          ({ impactCategory }) => impactCategory === "environmental_monetary",
        );
        if (baseTotal.length === 0 && comparisonTotal.length === 0) {
          return null;
        }
        return (
          <ImpactComparisonTableSectionRow
            label="Impacts environnementaux monetarisés"
            subSection
            baseValue={sumListWithKey(baseTotal, "amount")}
            comparisonValue={sumListWithKey(comparisonTotal, "amount")}
          >
            {environmentalMonetaryCategories.map((category) => {
              switch (category) {
                case "avoided_co2_eq_emissions": {
                  const base = baseCase.impacts.socioeconomic.impacts.find(
                    (impact): impact is AvoidedCO2EqEmissions => impact.impact === category,
                  );
                  const comparison = comparisonCase.impacts.socioeconomic.impacts.find(
                    (impact): impact is AvoidedCO2EqEmissions => impact.impact === category,
                  );
                  if (!base && !comparison) {
                    return null;
                  }
                  return (
                    <>
                      <TableAccordionRow
                        label={getSocioEconomicImpactLabel("avoided_co2_eq_emissions")}
                        actor={getActorLabel(base?.actor ?? comparison?.actor ?? "")}
                        baseValue={base?.amount ?? 0}
                        comparisonValue={comparison?.amount ?? 0}
                        formatValueFn={formatValueFn}
                      >
                        {avoidedCo2eqEmissionsDetails
                          .map((detailsCategory) => ({
                            category: detailsCategory,
                            base: base?.details.find((item) => item.impact === detailsCategory)
                              ?.amount,
                            comparison: comparison?.details.find(
                              (item) => item.impact === detailsCategory,
                            )?.amount,
                          }))
                          .filter((item) => item.base || item.comparison)
                          .map((row, detailsIndex, currentArray) => (
                            <ImpactComparisonTableRow
                              key={row.category}
                              label={getSocioEconomicImpactLabel(row.category)}
                              isLast={detailsIndex === currentArray.length - 1}
                              baseValue={row.base ?? 0}
                              comparisonValue={row.comparison ?? 0}
                              formatValueFn={formatValueFn}
                            />
                          ))}
                      </TableAccordionRow>
                      <ImpactComparisonTableSeparatorRow />
                    </>
                  );
                }
                case "ecosystem_services": {
                  const base = baseCase.impacts.socioeconomic.impacts.find(
                    (impact): impact is EcosystemServicesImpact => impact.impact === category,
                  );
                  const comparison = comparisonCase.impacts.socioeconomic.impacts.find(
                    (impact): impact is EcosystemServicesImpact => impact.impact === category,
                  );
                  if (!base && !comparison) {
                    return null;
                  }
                  return (
                    <>
                      <TableAccordionRow
                        label={getSocioEconomicImpactLabel(category)}
                        actor={getActorLabel(base?.actor ?? comparison?.actor ?? "")}
                        baseValue={base?.amount ?? 0}
                        comparisonValue={comparison?.amount ?? 0}
                        formatValueFn={formatValueFn}
                      >
                        {ecosystemServicesDetails
                          .map((detailsCategory) => ({
                            category: detailsCategory,
                            base: base?.details.find((item) => item.impact === detailsCategory)
                              ?.amount,
                            comparison: comparison?.details.find(
                              (item) => item.impact === detailsCategory,
                            )?.amount,
                          }))
                          .filter((item) => item.base || item.comparison)
                          .map((row, detailsIndex, currentArray) => (
                            <ImpactComparisonTableRow
                              key={row.category}
                              label={getSocioEconomicImpactLabel(row.category)}
                              isLast={detailsIndex === currentArray.length - 1}
                              baseValue={row.base ?? 0}
                              comparisonValue={row.comparison ?? 0}
                              formatValueFn={formatValueFn}
                            />
                          ))}
                      </TableAccordionRow>
                      <ImpactComparisonTableSeparatorRow />
                    </>
                  );
                }
                case "water_regulation": {
                  const base = baseCase.impacts.socioeconomic.impacts.find(
                    ({ impact }) => impact === category,
                  );
                  const comparison = comparisonCase.impacts.socioeconomic.impacts.find(
                    ({ impact }) => impact === category,
                  );

                  if (!base && !comparison) {
                    return null;
                  }
                  return (
                    <>
                      <ImpactComparisonTableRow
                        label={getSocioEconomicImpactLabel(category)}
                        isFirst
                        isLast
                        actor={getActorLabel(base?.actor ?? comparison?.actor ?? "")}
                        baseValue={base?.amount ?? 0}
                        comparisonValue={comparison?.amount ?? 0}
                        formatValueFn={formatValueFn}
                      />
                      <ImpactComparisonTableSeparatorRow />
                    </>
                  );
                }
              }
            })}
          </ImpactComparisonTableSectionRow>
        );
      })()}
    </ImpactComparisonTableSectionRow>
  );
};

export default ImpactComparisonListSocioEconomicSection;
