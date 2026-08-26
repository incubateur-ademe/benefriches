import { useContext } from "react";
import { typedObjectEntries } from "shared";

import {
  EnvironmentalImpactMetricMainKeyName,
  EnvironmentalImpactMetricsByListViewCategory,
} from "@/features/projects/core/projectImpactsEnvironmental";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";

import { getEnvironmentalImpactLabel } from "../../getImpactLabel";
import ImpactItemDetails from "../ImpactItemDetails";
import ImpactItemGroup from "../ImpactItemGroup";
import ImpactSection from "../ImpactSection";

type Props = {
  impacts: EnvironmentalImpactMetricsByListViewCategory;
};

const getValueType = (name: EnvironmentalImpactMetricMainKeyName) => {
  switch (name) {
    case "avoidedCo2eqEmissions":
      return "co2";
    case "newPermeableSurface":
    case "nonContaminatedSurfaceArea":
      return "surface_area";
  }
};

const getSectionTitle = (name: keyof EnvironmentalImpactMetricsByListViewCategory) => {
  switch (name) {
    case "co2eq":
      return "Impacts sur le CO2-eq";
    case "soils":
      return "Impacts sur  les sols";
  }
};

const EnvironmentalListSection = ({ impacts }: Props) => {
  const { getDetailsLink } = useContext(ImpactModalDescriptionContext);

  return (
    <ImpactSection
      isMain
      title="Impacts environnementaux"
      labelProps={getDetailsLink({
        sectionName: "environmental",
      })}
    >
      {typedObjectEntries(impacts).map(([group, list]) =>
        list.length > 0 ? (
          <ImpactSection
            title={getSectionTitle(group)}
            key={`environmental.${group}`}
            labelProps={getDetailsLink({
              sectionName: `environmental.${group}`,
            })}
          >
            {list.map(({ keyName, total, ...rest }) => (
              <ImpactItemGroup key={keyName} isClickable>
                <ImpactItemDetails
                  label={getEnvironmentalImpactLabel(keyName)}
                  value={total}
                  labelProps={getDetailsLink({
                    sectionName: `environmental.${group}`,
                    impactDetailsName: keyName,
                  })}
                  data={
                    "details" in rest
                      ? rest.details.map((item) => ({
                          label: getEnvironmentalImpactLabel(item.keyName),
                          value: item.total,

                          labelProps: getDetailsLink({
                            sectionName: `environmental.${group}`,
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

export default EnvironmentalListSection;
