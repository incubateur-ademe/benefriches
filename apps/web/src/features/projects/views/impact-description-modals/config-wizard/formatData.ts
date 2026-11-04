import {
  type AggregatedReconversionProjectOnSiteImpactItemView,
  formatMonetaryImpact,
  sumListWithKey,
  typedObjectEntries,
  groupIndirectEconomicImpactsByBearerAndCategory,
} from "shared";
import type { Link } from "type-route";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import { groupSocioEconomicImpactsByListViewCategory } from "@/features/projects/core/projectImpactsSocioEconomic";

import { getSocioEconomicImpactLabel } from "../../shared/getImpactLabel";
import {
  HUMANITY_IMPACTS_CATEGORIES,
  LOCAL_AUTHORITY_IMPACTS_CATEGORIES,
  LOCAL_PEOPLE_OR_COMPANY_IMPACTS_CATEGORIES,
} from "../../shared/impacts/impactGroupCategory";
import type { UpdateModalContentArgs } from "../ImpactModalDescriptionContext";
import { getSocioEconomicImpactColor } from "../colors";
import type { ModalHeaderProps } from "../modal-layout/ModalHeader";

const groupSocioEconomicImpactsByBearerAndCategory = ({
  getDetailsLink,
  impactsData,
}: {
  impactsData: ModalDataProps["impactsData"];
  getDetailsLink: (args: UpdateModalContentArgs) => Link | undefined;
}) => {
  const { total, localAuthority, localPeopleOrCompany, humanity } =
    groupIndirectEconomicImpactsByBearerAndCategory<AggregatedReconversionProjectOnSiteImpactItemView>(
      {
        indirectEconomicImpacts:
          impactsData.aggregatedReconversionImpacts.indirectEconomicImpacts.details,
        indirectEconomicImpactsTotal:
          impactsData.aggregatedReconversionImpacts.indirectEconomicImpacts.total,
        stakeholders: impactsData.stakeholders,
      },
    );

  const { total: totalLocalAuthority, ...localAuthorityList } = localAuthority;
  const { total: totalLocalPeopleOrCompany, ...localPeopleOrCompanyList } = localPeopleOrCompany;
  const { total: totalHumanity, ...humanityList } = humanity;

  return {
    total,
    localAuthority: {
      label: getLabelForBearer("localAuthority"),
      total: totalLocalAuthority,

      linkProps: getDetailsLink({
        sectionName: "socioEconomic.localAuthority",
      }),
      values: typedObjectEntries(localAuthorityList)
        .map(([category, items = []]) => ({
          items,
          value: sumListWithKey(items, "total"),
          label: LOCAL_AUTHORITY_IMPACTS_CATEGORIES[category].label,
          color: LOCAL_AUTHORITY_IMPACTS_CATEGORIES[category].color,
          name: category,
        }))
        .filter((item) => item.value !== 0),
    },
    localPeopleOrCompany: {
      label: getLabelForBearer("localPeopleOrCompany"),
      total: totalLocalPeopleOrCompany,

      linkProps: getDetailsLink({
        sectionName: "socioEconomic.localPeopleOrCompany",
      }),

      values: typedObjectEntries(localPeopleOrCompanyList)
        .map(([category, items = []]) => ({
          items,
          value: sumListWithKey(items, "total"),
          label: LOCAL_PEOPLE_OR_COMPANY_IMPACTS_CATEGORIES[category].label,
          color: LOCAL_PEOPLE_OR_COMPANY_IMPACTS_CATEGORIES[category].color,
          name: category,
        }))
        .filter((item) => item.value !== 0),
    },
    humanity: {
      label: getLabelForBearer("humanity"),
      total: totalHumanity,
      linkProps: getDetailsLink({
        sectionName: "socioEconomic.humanity",
      }),
      values: typedObjectEntries(humanityList)
        .map(([category, items = []]) => ({
          items,
          category: category,
          value: sumListWithKey(items, "total"),
          label: HUMANITY_IMPACTS_CATEGORIES[category].label,
          color: HUMANITY_IMPACTS_CATEGORIES[category].color,
          name: category,
        }))
        .filter((item) => item.value !== 0),
    },
  };
};

const getLabelForBearer = (name: "localAuthority" | "localPeopleOrCompany" | "humanity") => {
  switch (name) {
    case "localAuthority":
      return "Collectivité";
    case "localPeopleOrCompany":
      return "Riverains";
    case "humanity":
      return "Société française et mondiale";
  }
};

export const formatSocioEconomicDataProps = ({
  getDetailsLink,
  impactsData,
}: {
  impactsData: ModalDataProps["impactsData"];
  getDetailsLink: (args: UpdateModalContentArgs) => Link | undefined;
}): ModalHeaderProps["dataProps"] => {
  const { total, localAuthority, localPeopleOrCompany, humanity } =
    groupSocioEconomicImpactsByBearerAndCategory({ getDetailsLink, impactsData });

  const data = [localAuthority, localPeopleOrCompany, humanity].filter(
    (item) => item.values.length > 0,
  );

  return {
    type: "groupedColumn",
    headerProps: {
      value: {
        state: total > 0 ? "success" : "error",
        text: formatMonetaryImpact(total),
        description: "répartis entre plusieurs bénéficiaires",
      },
    },
    tableProps: {
      data: data,
      caption: "Liste des impacts socio-économiques",
    },
    chartProps: {
      data,
      format: "monetary",
      exportTitle: "🌍 Impacts socio-économiques",
    },
  };
};

export const formatSubsectionImpactsDataProps = ({
  getDetailsLink,
  impactsData,
  key,
}: {
  impactsData: ModalDataProps["impactsData"];
  getDetailsLink: (args: UpdateModalContentArgs) => Link | undefined;
  key: "localAuthority" | "localPeopleOrCompany" | "humanity";
}): ModalHeaderProps["dataProps"] => {
  const { total, ...impacts } = groupSocioEconomicImpactsByBearerAndCategory({
    getDetailsLink,
    impactsData,
  });

  const data = impacts[key];
  return {
    type: "groupedColumn",
    headerProps: {
      value: {
        state: total > 0 ? "success" : "error",
        text: formatMonetaryImpact(total),
      },
    },
    tableProps: {
      data: data.values.map((item) => ({
        ...item,
        total: item.value,
        values: groupSocioEconomicImpactsByListViewCategory(item.items).map(
          ({ keyName, total }) => ({
            name: keyName,
            value: total,
            label: getSocioEconomicImpactLabel(keyName),
            color: getSocioEconomicImpactColor(keyName),
            linkProps: getDetailsLink({
              sectionName: `socioEconomic.${key}`,
              impactDetailsName: keyName,
            }),
          }),
        ),
      })),
      caption: "Liste des impacts socio économiques",
    },
    chartProps: {
      exportTitle: "",
      data: data.values.map((item) => ({
        ...item,
        total: item.value,
        values: groupSocioEconomicImpactsByListViewCategory(item.items).map(
          ({ keyName, total }) => ({
            name: keyName,
            value: total,
            label: getSocioEconomicImpactLabel(keyName),
            color: getSocioEconomicImpactColor(keyName),
            linkProps: getDetailsLink({
              sectionName: `socioEconomic.${key}`,
              impactDetailsName: keyName,
            }),
          }),
        ),
      })),
      format: "monetary",
    },
  };
};
