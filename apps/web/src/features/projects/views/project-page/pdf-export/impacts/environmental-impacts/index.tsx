import { Text, View } from "@react-pdf/renderer";
import { typedObjectEntries } from "shared";

import {
  EnvironmentalImpactMetricMainKeyName,
  EnvironmentalImpactMetricsByListViewCategory,
} from "@/features/projects/core/projectImpactsEnvironmental";

import { getEnvironmentalImpactLabel } from "../../../impacts/getImpactLabel";
import ImpactItemDetails from "../../components/ImpactItemDetails";
import ImpactItemGroup from "../../components/ImpactItemGroup";
import ImpactsSection from "../../components/ImpactsSection";
import ListItem from "../../components/ListItem";
import PdfPage from "../../components/PdfPage";
import PdfPageSubtitle from "../../components/PdfPageSubtitle";
import { useSectionLabel } from "../../context";
import { pageIds } from "../../pageIds";
import { tw } from "../../styles";

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

type Props = {
  impacts: EnvironmentalImpactMetricsByListViewCategory;
};

export default function EnvironmentalImpactsPage({ impacts }: Props) {
  const sectionLabel = useSectionLabel("impacts-environment");
  return (
    <PdfPage id={pageIds["impacts-environment"]}>
      <PdfPageSubtitle>{sectionLabel}</PdfPageSubtitle>
      <View style={tw("mb-4")}>
        <Text>Les impacts environnementaux se décompose en différents types d'indicateurs :</Text>
        <View style={tw("py-2")}>
          <ListItem>les quantités de CO2-eq stocké ou d'émissions de CO2-eq évitées</ListItem>
          <ListItem>la surface non polluée</ListItem>
          <ListItem>la surface perméable, qu'elle soit végétalisée ou non</ListItem>
        </View>
      </View>
      {typedObjectEntries(impacts).map(([group, list]) =>
        list.length > 0 ? (
          <ImpactsSection title={getSectionTitle(group)} key={group}>
            {list.map(({ keyName, total, ...rest }) => (
              <ImpactItemGroup key={keyName}>
                <ImpactItemDetails
                  label={getEnvironmentalImpactLabel(keyName)}
                  value={total}
                  data={
                    "details" in rest
                      ? rest.details.map(({ keyName: detailsName, total: detailsImpact }) => ({
                          label: getEnvironmentalImpactLabel(detailsName),
                          value: detailsImpact,
                        }))
                      : undefined
                  }
                  type={getValueType(keyName)}
                />
              </ImpactItemGroup>
            ))}
          </ImpactsSection>
        ) : null,
      )}
    </PdfPage>
  );
}
