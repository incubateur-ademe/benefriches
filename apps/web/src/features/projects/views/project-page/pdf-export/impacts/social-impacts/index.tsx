import { Text, View } from "@react-pdf/renderer";
import { typedObjectEntries } from "shared";

import {
  SocialImpactMetricMainKeyName,
  SocialImpactMetricsByListViewCategory,
} from "@/features/projects/core/projectImpactsSocial";

import { getSocialImpactLabel } from "../../../../shared/getImpactLabel";
import ImpactItemDetails from "../../components/ImpactItemDetails";
import ImpactItemGroup from "../../components/ImpactItemGroup";
import ImpactsSection from "../../components/ImpactsSection";
import ListItem from "../../components/ListItem";
import PdfPage from "../../components/PdfPage";
import PdfPageSubtitle from "../../components/PdfPageSubtitle";
import { useSectionLabel } from "../../context";
import { pageIds } from "../../pageIds";
import { tw } from "../../styles";

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
type Props = {
  impacts: SocialImpactMetricsByListViewCategory;
};

const SocialImpactsPage = ({ impacts }: Props) => {
  const sectionLabel = useSectionLabel("impacts-social");

  return (
    <PdfPage id={pageIds["impacts-social"]}>
      <PdfPageSubtitle>{sectionLabel}</PdfPageSubtitle>
      <View style={tw("mb-4")}>
        <Text>La catégorie des impacts sociaux regroupe les impacts :</Text>
        <View style={tw("py-2")}>
          <ListItem>sur l'emploi</ListItem>
          <ListItem>sur la population locale</ListItem>
          <ListItem>sur la société française</ListItem>
        </View>
      </View>
      {typedObjectEntries(impacts).map(([group, list]) =>
        list.length > 0 ? (
          <ImpactsSection title={getSectionTitle(group)} key={group}>
            {list.map(({ keyName, total, ...rest }) => (
              <ImpactItemGroup key={keyName}>
                <ImpactItemDetails
                  label={getSocialImpactLabel(keyName)}
                  value={total}
                  data={
                    "details" in rest
                      ? rest.details.map(({ keyName: detailsName, total: detailsImpact }) => ({
                          label: getSocialImpactLabel(detailsName),
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
};

export default SocialImpactsPage;
