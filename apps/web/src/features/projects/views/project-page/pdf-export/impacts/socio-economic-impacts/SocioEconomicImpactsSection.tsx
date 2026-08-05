import { View } from "@react-pdf/renderer";

import { SocioEconomicImpactsByBearerListView } from "@/features/projects/core/projectImpactsSocioEconomic";

import { getSocioEconomicImpactLabel } from "../../../impacts/getImpactLabel";
import ImpactItemDetails from "../../components/ImpactItemDetails";
import ImpactItemGroup from "../../components/ImpactItemGroup";
import ImpactsSection from "../../components/ImpactsSection";

type Props = {
  impacts: SocioEconomicImpactsByBearerListView;
  sectionName: "humanity" | "localPeopleOrCompany" | "localAuthority";
};

const getSectionTitle = (sectionName: Props["sectionName"]) => {
  switch (sectionName) {
    case "humanity":
      return "Impacts économiques pour la société française et mondiale";
    case "localPeopleOrCompany":
      return "Impacts économiques pour les riverains";
    case "localAuthority":
      return "Impacts économiques pour la collectivité locale";
  }
};

export default function SocioEconomicImpactsSection({ impacts, sectionName }: Props) {
  if (impacts[sectionName].impacts.length === 0) {
    return null;
  }

  return (
    <View id={`impacts.socio_economic.${sectionName}`}>
      <ImpactsSection
        title={getSectionTitle(sectionName)}
        total={impacts[sectionName].total}
        valueType="monetary"
      >
        {impacts[sectionName].impacts.map(({ keyName, total, ...rest }) => (
          <ImpactItemGroup key={keyName}>
            <ImpactItemDetails
              value={total}
              label={getSocioEconomicImpactLabel(keyName)}
              actor={"bearerName" in rest ? rest.bearerName : undefined}
              data={
                "details" in rest
                  ? rest.details.map((item) => ({
                      label: getSocioEconomicImpactLabel(item.keyName),
                      value: item.total,
                    }))
                  : undefined
              }
              type="monetary"
            />
          </ImpactItemGroup>
        ))}
      </ImpactsSection>
    </View>
  );
}
