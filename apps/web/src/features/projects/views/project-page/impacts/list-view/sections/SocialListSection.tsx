import { useContext } from "react";
import { typedObjectEntries } from "shared";

import {
  SocialImpactMetricMainKeyName,
  SocialImpactMetricsByListViewCategory,
} from "@/features/projects/core/projectImpactsSocial";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";

import { getSocialImpactLabel } from "../../getImpactLabel";
import ImpactItemDetails from "../ImpactItemDetails";
import ImpactItemGroup from "../ImpactItemGroup";
import ImpactSection from "../ImpactSection";

type Props = {
  impacts: SocialImpactMetricsByListViewCategory;
};

const getValueType = (name: SocialImpactMetricMainKeyName) => {
  switch (name) {
    case "avoidedFricheAccidents":
    case "avoidedTrafficAccidents":
    case "avoidedVehiculeKilometers":
    case "householdsPoweredByRenewableEnergy":
      return "default";
    case "fullTimeJobs":
      return "etp";
    case "timeTravelSavedInHours":
      return "time";
  }
};

const getSectionTitle = (name: keyof SocialImpactMetricsByListViewCategory) => {
  switch (name) {
    case "humanity":
      return "Impacts sur la société française";
    case "localPeopleOrCompany":
      return "Impacts sur la population locale";
    case "jobs":
      return "Impacts sur l'emploi";
  }
};

const SocialListSection = ({ impacts }: Props) => {
  const { getDetailsLink } = useContext(ImpactModalDescriptionContext);

  return (
    <ImpactSection
      title="Impacts sociaux"
      isMain
      labelProps={getDetailsLink({ sectionName: "social" })}
    >
      {typedObjectEntries(impacts).map(([group, list]) =>
        list.length > 0 ? (
          <ImpactSection
            title={getSectionTitle(group)}
            key={`social.${group}`}
            labelProps={getDetailsLink({ sectionName: `social.${group}` })}
          >
            {list.map(({ keyName, total, ...rest }) => (
              <ImpactItemGroup key={keyName} isClickable>
                <ImpactItemDetails
                  label={getSocialImpactLabel(keyName)}
                  value={total}
                  labelProps={getDetailsLink({
                    sectionName: `social.${group}`,
                    impactDetailsName: keyName,
                  })}
                  data={
                    "details" in rest
                      ? rest.details.map((item) => ({
                          label: getSocialImpactLabel(item.keyName),
                          value: item.total,
                          labelProps: getDetailsLink({
                            sectionName: `social.${group}`,
                            impactDetailsName: item.keyName,
                          }),
                        }))
                      : undefined
                  }
                  type={getValueType(keyName)}
                />
              </ImpactItemGroup>
            ))}
          </ImpactSection>
        ) : null,
      )}
    </ImpactSection>
  );
};

export default SocialListSection;
