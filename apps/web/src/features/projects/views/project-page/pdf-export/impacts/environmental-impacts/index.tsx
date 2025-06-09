import { Text, View } from "@react-pdf/renderer";

import { EnvironmentalImpact } from "@/features/projects/domain/projectImpactsEnvironmental";

import {
  getEnvironmentalDetailsImpactLabel,
  getEnvironmentalImpactLabel,
} from "../../../impacts/getImpactLabel";
import ImpactItemDetails from "../../components/ImpactItemDetails";
import ImpactItemGroup from "../../components/ImpactItemGroup";
import ImpactsSection from "../../components/ImpactsSection";
import ListItem from "../../components/ListItem";
import PdfPage from "../../components/PdfPage";
import PdfPageSubtitle from "../../components/PdfPageSubtitle";
import { pageIds } from "../../pageIds";
import { tw } from "../../styles";

const ENVIRONMENTAL_SECTIONS = {
  co2: ["co2_benefit"],
  soils: ["non_contaminated_surface_area", "permeable_surface_area"],
};

type Props = {
  impacts: EnvironmentalImpact[];
};

export default function EnvironmentalImpactsPage({ impacts }: Props) {
  const co2Impacts = impacts.filter(({ name }) => ENVIRONMENTAL_SECTIONS.co2.includes(name));
  const soilsImpacts = impacts.filter(({ name }) => ENVIRONMENTAL_SECTIONS.soils.includes(name));

  return (
    <PdfPage id={pageIds["impacts-environment"]}>
      <PdfPageSubtitle>1.4 Impacts environnementaux</PdfPageSubtitle>
      <View style={tw("mb-4")}>
        <Text>Les impacts environnementaux se décompose en différents types d'indicateurs :</Text>
        <View style={tw("py-2")}>
          <ListItem>les quantités de CO2-eq stocké ou d'émissions de CO2-eq évitées</ListItem>
          <ListItem>la surface non polluée</ListItem>
          <ListItem>la surface perméable, qu'elle soit végétalisée ou non</ListItem>
        </View>
      </View>
      {co2Impacts.length > 0 && (
        <ImpactsSection title="Impacts sur le CO2-eq">
          {co2Impacts.map(({ name, impact, type }) => (
            <ImpactItemGroup key={name}>
              <ImpactItemDetails
                label={getEnvironmentalImpactLabel(name)}
                value={impact.difference}
                data={
                  impact.details
                    ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                        label: getEnvironmentalDetailsImpactLabel(name, detailsName),
                        value: detailsImpact.difference,
                      }))
                    : undefined
                }
                type={type}
              />
            </ImpactItemGroup>
          ))}
        </ImpactsSection>
      )}
      {soilsImpacts.length > 0 && (
        <ImpactsSection title="Impacts sur  les sols">
          {soilsImpacts.map(({ name, impact, type }) => (
            <ImpactItemGroup key={name}>
              <ImpactItemDetails
                label={getEnvironmentalImpactLabel(name)}
                value={impact.difference}
                data={
                  impact.details
                    ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                        label: getEnvironmentalDetailsImpactLabel(name, detailsName),
                        value: detailsImpact.difference,
                      }))
                    : undefined
                }
                type={type}
              />
            </ImpactItemGroup>
          ))}
        </ImpactsSection>
      )}
    </PdfPage>
  );
}
